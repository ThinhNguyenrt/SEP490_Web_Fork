export type OtherSevenDraft = {
  name: string;
  detail: string;
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

const getOtherSevenSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const items = toRecordArray(value);
    return items[items.length - 1] ?? {};
  }

  return toRecord(value);
};

export const createEmptyOtherSevenDraft = (): OtherSevenDraft => ({
  name: "",
  detail: "",
});

export const createOtherSevenDraft = (value: unknown): OtherSevenDraft => {
  const source = getOtherSevenSource(value);

  return {
    name: toText(source.name),
    detail: toText(source.detail),
  };
};
