export type IntroOneDraft = {
  fullName: string;
  studyField: string;
  email: string;
  phone: string;
  description: string;
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

export const createIntroOneDraft = (value: unknown): IntroOneDraft => {
  const data = toRecord(value);

  // Support both 'fullName' and 'name' fields from backend
  const fullName = toText(data.fullName) || toText(data.name);

  return {
    fullName: fullName,
    studyField: toText(data.studyField),
    email: toText(data.email),
    phone: toText(data.phone),
    description: toText(data.description),
    avatar: toText(data.avatar) || "", // Ensure avatar is never null or undefined
  };
};
