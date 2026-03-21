export type ReferenceOneDraft = {
  name: string;
  position: string;
  email: string;
  contactInfo: string;
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }

  return {};
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toRecord(item));
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

const getReferenceSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return toRecordArray(value)[0] ?? {};
  }

  return toRecord(value);
};

export const createReferenceOneDraft = (value: unknown): ReferenceOneDraft => {
  const source = getReferenceSource(value);

  return {
    name: toText(source.name),
    position: toText(source.position),
    email: toText(source.mail ?? source.email),
    contactInfo: toText(source.phone ?? source.detail),
  };
};
