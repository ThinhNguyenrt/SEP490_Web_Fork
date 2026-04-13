export type IntroOneDraft = {
  fullName: string;
  studyField: string;
  email: string;
  phone: string;
  description: string;
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

export const createIntroOneDraft = (value: unknown, userInfo?: UserInfo): IntroOneDraft => {
  const data = toRecord(value);

  // Support both 'fullName' and 'name' fields from backend
  const fullName = toText(data.fullName) || toText(data.name) || toText(userInfo?.fullName) || toText(userInfo?.name) || "";
  const email = toText(data.email) || toText(userInfo?.email) || "";
  const phone = toText(data.phone) || toText(userInfo?.phone) || "";

  return {
    fullName: fullName,
    studyField: toText(data.studyField),
    email: email,
    phone: phone,
    description: toText(data.description),
    avatar: toText(data.avatar) || "", // Ensure avatar is never null or undefined
  };
};
