export type SkillTwoCategory = "languages" | "frameworks" | "tools";

export type SkillTwoDraft = {
  languages: string[];
  frameworks: string[];
  tools: string[];
};

const normalizeSkillName = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return normalizeSkillName(value);
  }

  if (typeof value === "number") {
    return normalizeSkillName(String(value));
  }

  return "";
};

const extractSkillName = (item: unknown): string => {
  if (typeof item === "string" || typeof item === "number") {
    return toText(item);
  }

  if (item && typeof item === "object" && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    return toText(record.name ?? record.skillName ?? record.label);
  }

  return "";
};

const toSkillArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => extractSkillName(item));
};

const deduplicateSkills = (skills: string[] | undefined): string[] => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const used = new Set<string>();
  const nextSkills: string[] = [];

  skills.forEach((skillName) => {
    if (typeof skillName !== "string" && typeof skillName !== "number") {
      return;
    }
    
    const normalized = normalizeSkillName(String(skillName));
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (used.has(key)) {
      return;
    }

    used.add(key);
    nextSkills.push(normalized);
  });

  return nextSkills;
};

export const normalizeSkillTwoDraft = (draft: SkillTwoDraft): SkillTwoDraft => {
  return {
    languages: deduplicateSkills(draft.languages),
    frameworks: deduplicateSkills(draft.frameworks),
    tools: deduplicateSkills(draft.tools),
  };
};

export const createSkillTwoDraft = (value: unknown): SkillTwoDraft => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      languages: [],
      frameworks: [],
      tools: [],
    };
  }

  const record = value as Record<string, unknown>;

  return normalizeSkillTwoDraft({
    languages: toSkillArray(record.languages),
    frameworks: toSkillArray(record.frameworks),
    tools: toSkillArray(record.tools),
  });
};
