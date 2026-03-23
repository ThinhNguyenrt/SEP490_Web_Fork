export type EducationTwoDraft = {
  time: string;
  department: string;
  schoolName: string;
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
  department: "",
  schoolName: "",
  description: "",
});

const getEducationTwoSource = (value: unknown): Record<string, unknown> => {
  return toRecord(value);
};

export const createEducationTwoDraft = (value: unknown): EducationTwoDraft => {
  const source = Array.isArray(value)
    ? getEducationTwoSource(value[value.length - 1])
    : getEducationTwoSource(value);

  return {
    time: toText(source.time),
    department: toText(source.department),
    schoolName: toText(source.schoolName),
    description: toText(source.description),
  };
};
