export type IntroThreeDraft = {
  fullName: string;
  school: string;
  department: string;
  studyField: string;
  gpa: string;
  avatar: string;
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

export const createIntroThreeDraft = (value: unknown, userInfo?: UserInfo): IntroThreeDraft => {
  const data = toRecord(value);

  const fullName = toText(data.fullName ?? data.name) || toText(userInfo?.fullName) || toText(userInfo?.name) || "";

  return {
    fullName: fullName,
    school: toText(data.school ?? data.schoolName),
    department: toText(data.department),
    studyField: toText(data.studyField ?? data.title),
    gpa: toText(data.gpa),
    avatar: toText(data.avatar),
  };
};

export const createEmptyIntroThreeDraft = (): IntroThreeDraft => ({
  fullName: "",
  school: "",
  department: "",
  studyField: "",
  gpa: "",
  avatar: "",
});
