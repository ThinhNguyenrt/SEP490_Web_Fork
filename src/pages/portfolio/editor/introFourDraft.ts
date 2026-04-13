export type IntroFourDraft = {
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

export const createEmptyIntroFourDraft = (): IntroFourDraft => ({
  fullName: "",
  school: "",
  department: "",
  studyField: "",
  gpa: "",
  avatar: "",
});

const getIntroFourSource = (value: unknown): Record<string, unknown> => {
  return toRecord(value);
};

export const createIntroFourDraft = (value: unknown): IntroFourDraft => {
  const source = getIntroFourSource(value);

  return {
    fullName: toText(source.fullName ?? source.name),
    school: toText(source.school ?? source.schoolName),
    department: toText(source.department),
    studyField: toText(source.studyField ?? source.title),
    gpa: toText(source.gpa),
    avatar: toText(source.avatar),
  };
};
