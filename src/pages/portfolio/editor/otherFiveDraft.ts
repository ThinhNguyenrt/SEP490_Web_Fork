export type OtherFiveDraft = {
  topics: string[];
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

export const createEmptyOtherFiveDraft = (): OtherFiveDraft => ({
  topics: [],
});

export const createOtherFiveDraft = (value: unknown): OtherFiveDraft => {
  if (Array.isArray(value)) {
    const topics = value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return toText(record.name).trim() || toText(record.detail).trim();
        }

        return "";
      })
      .filter((topic) => topic.length > 0);

    return {
      topics,
    };
  }

  return createEmptyOtherFiveDraft();
};
