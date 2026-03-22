export type EducationThreeDraft = {
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

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toRecord(item));
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

export const createEmptyEducationThreeDraft = (): EducationThreeDraft => ({
  time: "",
  gpa: "",
  qualified: "",
  description: "",
});

const getEducationThreeSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const items = toRecordArray(value);
    const lastItem = items[items.length - 1];
    return lastItem ?? {};
  }

  return toRecord(value);
};

export const createEducationThreeDraft = (value: unknown): EducationThreeDraft => {
  const source = getEducationThreeSource(value);

  return {
    time: toText(source.time),
    gpa: toText(source.gpa),
    qualified: toText(source.qualified),
    description: toText(source.description),
  };
};
