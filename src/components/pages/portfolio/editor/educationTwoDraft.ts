export type EducationTwoDraft = {
  time: string;
  gpa: string;
  qualified: string;
  description: string;
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }

  return {};
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

export const createEmptyEducationTwoDraft = (): EducationTwoDraft => ({
  time: "",
  gpa: "",
  qualified: "",
  description: "",
});

const getEducationTwoSource = (value: unknown): Record<string, unknown> => {
  return toRecord(value);
};

export const createEducationTwoDraft = (value: unknown): EducationTwoDraft => {
  const source = getEducationTwoSource(value);

  return {
    time: toText(source.time),
    gpa: toText(source.gpa),
    qualified: toText(source.qualified),
    description: toText(source.description),
  };
};
