export type ResearchOneDraft = {
  title: string;
  conference: string;
  date: string;
  link: string;
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

export const createEmptyResearchOneDraft = (): ResearchOneDraft => ({
  title: "",
  conference: "",
  date: "",
  link: "",
});

export const createResearchOneDraft = (value: unknown): ResearchOneDraft => {
  if (Array.isArray(value)) {
    const lastItem = value[value.length - 1];

    if (lastItem && typeof lastItem === "object") {
      const record = lastItem as Record<string, unknown>;

      return {
        title: toText(record.name) || toText(record.title),
        conference: toText(record.conference) || toText(record.description),
        date: toText(record.time) || toText(record.date),
        link: toText(record.link),
      };
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      title: toText(record.name) || toText(record.title),
      conference: toText(record.conference) || toText(record.description),
      date: toText(record.time) || toText(record.date),
      link: toText(record.link),
    };
  }

  return createEmptyResearchOneDraft();
};
