export type IntroFiveDraft = {
  fullName: string;
  school: string;
  department: string;
  studyField: string;
  gpa: string;
  avatar: string;
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

export const createEmptyIntroFiveDraft = (): IntroFiveDraft => ({
  fullName: "",
  school: "",
  department: "",
  studyField: "",
  gpa: "",
  avatar: "",
});

const getIntroFiveSource = (value: unknown): Record<string, unknown> => {
  return toRecord(value);
};

export const createIntroFiveDraft = (value: unknown): IntroFiveDraft => {
  const source = getIntroFiveSource(value);

  return {
    fullName: toText(source.fullName),
    school: toText(source.school),
    department: toText(source.department),
    studyField: toText(source.studyField),
    gpa: toText(source.gpa),
    avatar: toText(source.avatar),
  };
};
