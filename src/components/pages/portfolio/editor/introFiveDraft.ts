export type IntroFiveDraft = {
  fullName: string;
  school: string;
  department: string;
  experience: string;
  avatar: string;
  studyField: string;
  title: string;
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
  experience: "",
  avatar: "",
  studyField: "",
  title: "",
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
    experience: toText(source.experience),
    avatar: toText(source.avatar),
    studyField: toText(source.studyField),
    title: toText(source.title),
  };
};
