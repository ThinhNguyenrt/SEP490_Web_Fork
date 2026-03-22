export type IntroThreeDraft = {
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

export const createIntroThreeDraft = (value: unknown): IntroThreeDraft => {
  const data = toRecord(value);

  return {
    fullName: toText(data.fullName ?? data.name),
    school: toText(data.school ?? data.schoolName),
    department: toText(data.department),
    studyField: toText(data.studyField ?? data.title),
    gpa: toText(data.gpa),
    avatar: toText(data.avatar),
  };
};
