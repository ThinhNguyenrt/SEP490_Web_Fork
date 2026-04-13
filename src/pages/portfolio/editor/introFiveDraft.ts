export type IntroFiveDraft = {
  fullName: string;
  school: string;
  department: string;
  experience: string;
  avatar: string;
  studyField: string;
  title: string;
};

export type UserInfo = {
  fullName?: string;
  email?: string;
  phone?: string;
  name?: string;
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

export const createIntroFiveDraft = (value: unknown, userInfo?: UserInfo): IntroFiveDraft => {
  const source = getIntroFiveSource(value);

  const fullName = toText(source.fullName ?? source.name) || toText(userInfo?.fullName) || toText(userInfo?.name) || "";

  return {
    fullName: fullName,
    school: toText(source.school ?? source.schoolName),
    department: toText(source.department),
    experience: toText(source.experience),
    avatar: toText(source.avatar),
    studyField: toText(source.studyField ?? source.title),
    title: toText(source.title),
  };
};
