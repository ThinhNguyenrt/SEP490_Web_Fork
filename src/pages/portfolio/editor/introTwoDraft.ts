export type IntroTwoDraft = {
  fullName: string;
  position: string;
  yearOfStudy: string;
  school: string;
  studyField: string;
  email: string;
  phoneNumber: string;
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

export const createIntroTwoDraft = (value: unknown): IntroTwoDraft => {
  const data = toRecord(value);

  return {
    fullName: toText(data.fullName ?? data.name),
    position: toText(data.position ?? data.department ?? data.title),
    yearOfStudy: toText(data.yearOfStudy),
    school: toText(data.school ?? data.schoolName),
    studyField: toText(data.studyField),
    email: toText(data.email),
    phoneNumber: toText(data.phoneNumber ?? data.phone),
    avatar: toText(data.avatar),
  };
};
