export type ActivityOneDraft = {
  name: string;
  date: string;
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

const getActivitySource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return toRecordArray(value)[0] ?? {};
  }

  return toRecord(value);
};

export const createActivityOneDraft = (value: unknown): ActivityOneDraft => {
  const source = getActivitySource(value);

  return {
    name: toText(source.name),
    date: toText(source.date ?? source.time),
    description: toText(source.description),
  };
};
