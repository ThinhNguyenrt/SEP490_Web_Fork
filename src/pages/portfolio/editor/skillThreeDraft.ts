export type SkillThreeDraft = {
  name: string;
  description: string;
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
};

export const createEmptySkillThreeDraft = (): SkillThreeDraft => ({
  name: "",
  description: "",
});

export const createSkillThreeDraft = (value: unknown): SkillThreeDraft => {
  if (Array.isArray(value)) {
    const firstItem = value[0];
    if (typeof firstItem === "object" && firstItem !== null) {
      const record = firstItem as Record<string, unknown>;
      return {
        name: toText(record.name),
        description: toText(record.description),
      };
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      name: toText(record.name),
      description: toText(record.description),
    };
  }

  return createEmptySkillThreeDraft();
};
