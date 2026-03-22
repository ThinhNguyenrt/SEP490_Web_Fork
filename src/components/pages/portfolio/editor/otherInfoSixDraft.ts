export type OtherInfoSixDraft = {
  softSkills: string[];
};

const normalizeSkill = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return normalizeSkill(value);
  }

  if (typeof value === "number") {
    return normalizeSkill(String(value));
  }

  return "";
};

const extractSoftSkill = (item: unknown): string => {
  if (typeof item === "string" || typeof item === "number") {
    return toText(item);
  }

  if (item && typeof item === "object" && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    return toText(record.name ?? record.detail ?? record.label);
  }

  return "";
};

const deduplicateSkills = (skills: string[]): string[] => {
  const used = new Set<string>();
  const nextSkills: string[] = [];

  skills.forEach((skillName) => {
    const normalized = normalizeSkill(skillName);
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

export const normalizeOtherInfoSixDraft = (draft: OtherInfoSixDraft): OtherInfoSixDraft => {
  return { softSkills: deduplicateSkills(draft.softSkills) };
};

export const createOtherInfoSixDraft = (value: unknown): OtherInfoSixDraft => {
  if (!Array.isArray(value)) {
    return { softSkills: [] };
  }

  return normalizeOtherInfoSixDraft({
    softSkills: value.map((item) => extractSoftSkill(item)),
  });
};
