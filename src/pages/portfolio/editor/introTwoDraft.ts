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

export const createIntroTwoDraft = (value: unknown, userInfo?: UserInfo): IntroTwoDraft => {
  const data = toRecord(value);

  const fullName = toText(data.fullName ?? data.name) || toText(userInfo?.fullName) || toText(userInfo?.name) || "";
  const email = toText(data.email) || toText(userInfo?.email) || "";
  const phoneNumber = toText(data.phoneNumber ?? data.phone) || toText(userInfo?.phone) || "";

  return {
    fullName: fullName,
    position: toText(data.position ?? data.department ?? data.title),
    yearOfStudy: toText(data.yearOfStudy),
    school: toText(data.school ?? data.schoolName),
    studyField: toText(data.studyField),
    email: email,
    phoneNumber: phoneNumber,
    avatar: toText(data.avatar),
  };
};
