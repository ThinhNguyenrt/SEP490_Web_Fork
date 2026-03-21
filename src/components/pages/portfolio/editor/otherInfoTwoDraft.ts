export type OtherInfoTwoDraft = {
  detail: string;
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

export const createOtherInfoTwoDraft = (value: unknown): OtherInfoTwoDraft => {
  if (Array.isArray(value)) {
    const firstItem = toRecord(value[0]);
    return { detail: toText(firstItem.detail) };
  }

  const data = toRecord(value);
  return { detail: toText(data.detail) };
};
