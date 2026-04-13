export type SkillOneDraft = {
  skills: string[];
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

export const createSkillOneDraft = (value: unknown): SkillOneDraft => {
  if (!Array.isArray(value)) {
    return { skills: [] };
  }

  const skills = deduplicateSkills(value.map((item) => extractSkillName(item)));

  return { skills };
};
