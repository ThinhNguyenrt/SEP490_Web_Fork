export type AwardOneDraft = {
  name: string;
  date: string;
  organization: string;
  description: string;
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

const getAwardSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return toRecordArray(value)[0] ?? {};
  }

  return toRecord(value);
};

export const createAwardOneDraft = (value: unknown): AwardOneDraft => {
  const source = getAwardSource(value);

  return {
    name: toText(source.name),
    date: toText(source.date ?? source.time),
    organization: toText(source.organization ?? source.issuer ?? source.provider),
    description: toText(source.description),
  };
};
