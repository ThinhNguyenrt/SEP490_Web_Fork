export type IntroOneDraft = {
  fullName: string;
  title: string;
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

  return {
    fullName: toText(data.fullName),
    title: toText(data.title),
    email: toText(data.email),
    phone: toText(data.phone),
    description: toText(data.description),
    avatar: toText(data.avatar),
  };
};
