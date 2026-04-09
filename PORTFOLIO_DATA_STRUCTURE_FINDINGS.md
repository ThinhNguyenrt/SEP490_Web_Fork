# Portfolio Block Data Structure - Findings Report

## Executive Summary
Found critical data structure mismatches between:
- API response structure
- Draft function expectations  
- Block rendering requirements
- Save handler transformations

---

## 1. API Data Structures (from `portfolio.api.ts`)

### Type Definitions
```typescript
export type SkillItem = {
  name: string;
};

export type OtherInfoItem = {
  detail: string;
};

export type PortfolioBlock = {
  id: number;
  type: string;
  variant: string;
  order: number;
  data: any;  // ⚠️ ANY TYPE - dangerous!
};
```

### Mock Data Examples
```typescript
// SKILL block - array of objects
{
  id: 102,
  type: "SKILL",
  variant: "SKILLONE",
  data: [
    { name: "JavaScript" },
    { name: "React" },
    ...
  ]
}

// OTHERINFO blocks - various data structures
{
  id: 104,
  type: "OTHERINFO", 
  variant: "OTHERONE",  // array expected
  data: [...]
}
```

---

## 2. CRITICAL MISMATCHES IDENTIFIED

### ❌ MISMATCH #1: OTHERINFO ARRAY vs OBJECT VARIANTS

**The Problem:**
OTHERINFO has multiple variants with conflicting data structures:

| Variant | Expected Data Structure | How Draft Converts It |
|---------|------------------------|----------------------|
| OTHERONE | `Array<string>` | Expects array, extracts `{ detail \| name \| label }` |
| OTHERTWO | `{ detail: string }` | Expects object OR array, takes first item's `detail` |
| OTHERFIVE | `Array<string>` | Expects array, extracts `{ name \| detail }` |
| OTHERSIX | `Array<string>` | Expects array, extracts strings from `{ name \| detail \| label }` |
| OTHERSEVEN | `Array<Object>` | Expects array, takes LAST item's `{ name, detail }` |
| OTHEREIGHT | `{ title, licenseNumber, issuer, status, detail }` | Expects object |

**Code Location:** `CreatePortfolio.tsx` lines 467-500
```typescript
const OTHERINFO_OBJECT_VARIANTS = new Set([
  "OTHERTWO",
  "OTHERTHREE", 
  "OTHERFOUR",
  "OTHEREIGHT",
]);

case "OTHERINFO":
  if (normalizedVariant === "OTHERONE") {
    return [];  // ✅ Array
  }
  if (normalizedVariant === "OTHERTWO" || "OTHERTHREE" || "OTHERFOUR") {
    return { detail: "" };  // ✅ Object
  }
  if (normalizedVariant === "OTHERFIVE" || "OTHERSIX") {
    return [];  // ✅ Array
  }
```

**Impact:** 
- When loading an existing portfolio, `selectedBlock.data` could be either array or object
- Draft functions must handle both cases robustly

---

### ❌ MISMATCH #2: SKILL ARRAY TO OBJECT TRANSFORMATION

**The Problem:**
Skills are stored as objects with `name` property, but draft functions expect pure strings:

**API/Storage Format:**
```typescript
data: [
  { name: "JavaScript" },
  { name: "React" },
  ...
]
```

**Draft Function Conversion** (`skillOneDraft.ts` line 60):
```typescript
export const createSkillOneDraft = (value: unknown): SkillOneDraft => {
  if (!Array.isArray(value)) {
    return { skills: [] };  // Returns empty if not array
  }
  
  // Extracts name from objects
  const skills = deduplicateSkills(
    value.map((item) => extractSkillName(item))
  );
  return { skills };  // Returns string array
};

const extractSkillName = (item: unknown): string => {
  if (typeof item === "string" || typeof item === "number") {
    return toText(item);
  }
  
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    // Falls back to skillName, label if name missing
    return toText(record.name ?? record.skillName ?? record.label);
  }
  return "";
};
```

**Save Handler Transformation** (`CreatePortfolio.tsx` line 2192):
```typescript
const handleSkillOneSave = (nextDraft: SkillOneDraft) => {
  updateSelectedBlockData(() => {
    // Converts string[] back to object array with 'name'
    return nextDraft.skills.map((skillName) => ({ name: skillName }));
  });
};
```

**Impact:**
- ✅ Round-trip works correctly (objects → strings → objects)
- ✅ Fallback logic handles missing `name` field

---

### ❌ MISMATCH #3: OTHERINFO STRING TO OBJECT TRANSFORMATION

**The Problem:**
Similar to skills, but with `detail` property:

**OtherInfoOne (Interests):**

Draft Function (`otherInfoOneDraft.ts` line 60):
```typescript
export const createOtherInfoOneDraft = (value: unknown): OtherInfoOneDraft => {
  if (!Array.isArray(value)) {
    return { interests: [] };  // ⚠️ Null/undefined data fails silently
  }
  
  const interests = deduplicateInterests(
    value.map((item) => extractInterest(item))  // Expects array
  );
  return { interests };  // Returns string array
};

const extractInterest = (item: unknown): string => {
  if (typeof item === "string" || typeof item === "number") {
    return toText(item);
  }
  
  const record = toRecord(item);
  // ✅ Tries multiple fields: detail, name, label
  return toText(record.detail ?? record.name ?? record.label);
};
```

**Save Handler** (`CreatePortfolio.tsx` line 2597):
```typescript
const handleOtherInfoOneSave = (nextDraft: OtherInfoOneDraft) => {
  updateSelectedBlockData(() => {
    // Stores as objects with 'detail' property
    return nextDraft.interests.map((interestName) => ({ detail: interestName }));
  });
};
```

**Round-trip:** `[{ detail: "Football" }]` → `["Football"]` → `[{ detail: "Football" }]` ✅

---

### ❌ MISMATCH #4: OTHERINFOSIX SOFT SKILLS

**The Problem:**
Similar structure to skills but uses `softSkills` property in draft:

**Draft Function** (`otherInfoSixDraft.ts` line 50):
```typescript
export const createOtherInfoSixDraft = (value: unknown): OtherInfoSixDraft => {
  if (!Array.isArray(value)) {
    return { softSkills: [] };  // ⚠️ Silent failure on non-array
  }
  
  return normalizeOtherInfoSixDraft({
    softSkills: value.map((item) => extractSoftSkill(item)),
  });
};
```

**Save Handler** (`CreatePortfolio.tsx` line 2647):
```typescript
const handleOtherInfoSixSave = (nextDraft: OtherInfoSixDraft) => {
  updateSelectedBlockData(() => {
    // Converts softSkills string[] → { name: string }[]
    return nextDraft.softSkills.map((skillName) => ({ name: skillName }));
  });
};
```

**Round-trip:** `[{ name: "Leadership" }]` → `["Leadership"]` → `[{ name: "Leadership" }]` ✅

---

## 3. NULL/UNDEFINED DATA HANDLING ISSUES

### Issue Found: `OtherInfoTwoDraft`

**Code** (`otherInfoTwoDraft.ts` line 24):
```typescript
export const createOtherInfoTwoDraft = (value: unknown): OtherInfoTwoDraft => {
  if (Array.isArray(value)) {
    const firstItem = toRecord(value[0]);  // ⚠️ Handles array
    return { detail: toText(firstItem.detail) };
  }
  
  const data = toRecord(value);  // ⚠️ Handles object
  return { detail: toText(data.detail) };
};
```

**Problem:** 
- If `value` is `null` or `undefined`, both conditions fail
- `toRecord()` will return `{}`
- `toText(undefined)` returns `""`
- Result: `{ detail: "" }` - silently converts to empty

**Risk:** Data loss on load if API returns null

---

### Issue Found: All Draft Functions

**Silent Null Handling Pattern:**
```typescript
const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};  // ⚠️ Returns empty object for null/undefined
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";  // ⚠️ Returns empty string for null/undefined
};
```

**When `selectedBlock.data` is null/undefined:**
- No error thrown
- Silently converts to `{}` or `[]`
- Editor renders with empty state
- User doesn't know data was lost

---

## 4. BLOCK CREATION DEFAULT DATA

**Location:** `CreatePortfolio.tsx` line 400-500

```typescript
const createDefaultBlockData = (type: string, variant: string): unknown => {
  const normalizedType = normalizeBlockType(type);
  const normalizedVariant = variant.toUpperCase();

  case "SKILL":
    if (normalizedVariant === "SKILLTWO") {
      return {
        languages: [],
        frameworks: [],
        tools: [],
      };
    }
    return [];  // SKILLONE, SKILLTHREE default to empty array

  case "OTHERINFO":
    if (normalizedVariant === "OTHERONE") {
      return [];  // Empty array for interests
    }
    if (normalizedVariant === "OTHERTWO" || "OTHERTHREE" || "OTHERFOUR") {
      return { detail: "" };  // Object with empty detail
    }
    if (normalizedVariant === "OTHERFIVE" || "OTHERSIX") {
      return [];  // Array of objects
    }
    if (normalizedVariant === "OTHERSEVEN") {
      return [];  // Array of { name, detail }
    }
    if (normalizedVariant === "OTHEREIGHT") {
      return {
        title: "",
        licenseNumber: "",
        issuer: "",
        status: "",
        detail: "",
      };
    }
```

**Correct Pattern:** ✅ Matches draft function expectations

---

## 5. WHEN BLOCKS ARE SELECTED

**Location:** `CreatePortfolio.tsx` line 1415-1450

```typescript
const selectedBlock = useMemo(
  () => {
    const found = blocks.find((block) => block.id === selectedBlockId) ?? null;
    if (found) {
      console.log("📋 Block data:", found.data);  // Can be null/undefined!
    }
    return found;
  },
  [blocks, selectedBlockId],
);

const otherInfoOneInitialData = useMemo(() => {
  if (!selectedBlock || !isEditingOtherInfoOne) {
    return null;  // ⚠️ Returns null
  }
  
  return createOtherInfoOneDraft(selectedBlock.data);  // selectedBlock.data could be undefined
}, [isEditingOtherInfoOne, selectedBlock]);
```

**Possible States When Draft Function Called:**
1. ✅ `selectedBlock.data` is array: `[{ detail: "..." }]` → Works
2. ✅ `selectedBlock.data` is object: `{ detail: "..." }` → Works  
3. ❌ `selectedBlock.data` is null: `null` → Returns empty
4. ❌ `selectedBlock.data` is undefined: `undefined` → Returns empty
5. ❌ `selectedBlock` is null: Never calls function (but initialData is null)

---

## 6. RENDER FLOW FOR SKILL BLOCKS

**Example: SkillOne Variant**

### Loading Existing Portfolio:
```
API Response: { data: [{ name: "JavaScript" }, { name: "React" }] }
                    ↓
selectedBlock.data = [{ name: "JavaScript" }, { name: "React" }]
                    ↓
createSkillOneDraft(selectedBlock.data)
                    ↓
SkillOneDraft = { skills: ["JavaScript", "React"] }
                    ↓
SkillOneEditor initializes with { skills: [...] }
                    ↓
User edits and saves
                    ↓
handleSkillOneSave({ skills: ["JavaScript", "React", "TypeScript"] })
                    ↓
updateSelectedBlockData(() => 
  [{ name: "JavaScript" }, { name: "React" }, { name: "TypeScript" }]
)
                    ↓
Block data back to: [{ name: "..." }, ...]
```

**Round-trip works! ✅**

---

## 7. RENDER FLOW FOR OTHERINFO BLOCKS

### Loading OtherInfoOne (Interests):
```
API Response: { data: [{ detail: "Football" }, { detail: "Music" }] }
                    ↓
createOtherInfoOneDraft([{ detail: "Football" }, { detail: "Music" }])
                    ↓
extractInterest({ detail: "Football" }) → "Football"  ✅
extractInterest({ detail: "Music" }) → "Music"  ✅
                    ↓
OtherInfoOneDraft = { interests: ["Football", "Music"] }
                    ↓
OtherInfoOneEditor renders with selected interests
                    ↓
User adds "Guitar"
                    ↓
handleOtherInfoOneSave({ interests: ["Football", "Music", "Guitar"] })
                    ↓
updateSelectedBlockData(() => 
  [{ detail: "Football" }, { detail: "Music" }, { detail: "Guitar" }]
)
                    ↓
Block data: [{ detail: "..." }, ...]
```

**Round-trip works! ✅**

---

## 8. DATA STRUCTURE SUMMARY TABLE

| Block Type | Variant | Storage Format | Draft Format | Save Output |
|-----------|---------|----------------|--------------|-------------|
| SKILL | SKILLONE | `[{ name }]` | `{ skills: string[] }` | `[{ name }]` |
| SKILL | SKILLTWO | `{ languages, frameworks, tools }` | Same | Same |
| OTHERINFO | OTHERONE | `[{ detail }]` | `{ interests: string[] }` | `[{ detail }]` |
| OTHERINFO | OTHERTWO | `{ detail: string }` | `{ detail: string }` | `{ detail }` |
| OTHERINFO | OTHERFIVE | `[{ name }]` | `{ topics: string[] }` | `[{ name }]` |
| OTHERINFO | OTHERSIX | `[{ name }]` | `{ softSkills: string[] }` | `[{ name }]` |
| OTHERINFO | OTHERSEVEN | `[{ name, detail }]` | `{ name, detail }` | `[{ name, detail }]` |
| OTHERINFO | OTHEREIGHT | `{ title, licenseNumber, issuer, status, detail }` | Same | Same |

---

## 9. KEY VULNERABILITIES

### 🔴 HIGH RISK
1. **Null/Undefined Data Loss**
   - All draft functions silently convert null/undefined to empty
   - No warnings logged
   - User loses data unknowingly

2. **Unsafe `data: any` Type**
   - PortfolioBlock.data typed as `any`
   - No compile-time checks
   - Can break draft functions

3. **Array/Object Type Mismatch**
   - Different OTHERINFO variants expect different types
   - Wrong variant selected = silent data failure

### 🟡 MEDIUM RISK
4. **No Validation Before Save**
   - Draft functions accept any input
   - No error boundaries
   - Bad data silently stored

5. **Complex Variant Logic**
   - 8 OTHERINFO variants with different rules
   - Easy to misconfigure
   - Hard to track which variant needs which structure

---

## 10. RECOMMENDATIONS

### Immediate Fixes Needed:
1. ✅ **Add Null Checks**
   ```typescript
   if (selectedBlock?.data == null) {
     console.warn("Block data is null/undefined");
     return createEmptyOtherInfoOneDraft();
   }
   ```

2. ✅ **Type PortfolioBlock.data**
   ```typescript
   export type PortfolioBlock = {
     data: OtherInfoItem[] | SkillItem[] | { [key: string]: unknown };
     // Instead of 'any'
   }
   ```

3. ✅ **Add Data Validation**
   ```typescript
   export const validateOtherInfoOneData = (value: unknown): boolean => {
     if (!Array.isArray(value)) return false;
     return value.every(item => 
       item && typeof item === "object" && "detail" in item
     );
   }
   ```

4. ✅ **Log Warnings for Data Conversion**
   ```typescript
   if (!Array.isArray(value)) {
     console.warn("Expected array, got", typeof value, value);
   }
   ```

---

## File References
- **API Types:** [portfolio.api.ts](src/services/portfolio.api.ts)
- **Draft Functions:** 
  - [otherInfoOneDraft.ts](src/components/pages/portfolio/editor/otherInfoOneDraft.ts)
  - [skillOneDraft.ts](src/components/pages/portfolio/editor/skillOneDraft.ts)
  - [otherInfoSixDraft.ts](src/components/pages/portfolio/editor/otherInfoSixDraft.ts)
- **Save Handlers:** [CreatePortfolio.tsx#L2192](src/components/pages/portfolio/CreatePortfolio.tsx#L2192)
- **Default Data:** [CreatePortfolio.tsx#L400](src/components/pages/portfolio/CreatePortfolio.tsx#L400)

---

## Conclusion

The portfolio data structure has **working round-trip flows** for the main paths (save → load → edit → save), but has several **silent failure points** where null/undefined data could be lost without warning. The main challenges are:

1. **Multiple data structures** for same block type (OTHERINFO variants)
2. **Loose typing** on PortfolioBlock.data
3. **Silent null handling** in conversion functions
4. **Complex variant logic** spread across CreatePortfolio.tsx

The system **works for happy path** but needs defensive programming for edge cases.
