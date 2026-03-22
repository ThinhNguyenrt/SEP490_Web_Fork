export type ProjectThreeDraft = {
  name: string;
  action: string;
  publisher: string;
  description: string;
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

const getFirstLink = (record: Record<string, unknown>): string => {
  const projectLinks = Array.isArray(record.projectLinks) ? record.projectLinks : [];
  const links = Array.isArray(record.links) ? record.links : [];

  for (const item of [...projectLinks, ...links]) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const link = toText((item as Record<string, unknown>).link).trim();
    if (link) {
      return link;
    }
  }

  return toText(record.link).trim();
};

export const createEmptyProjectThreeDraft = (): ProjectThreeDraft => ({
  name: "",
  action: "",
  publisher: "",
  description: "",
  link: "",
});

export const createProjectThreeDraft = (value: unknown): ProjectThreeDraft => {
  if (Array.isArray(value)) {
    const lastItem = value[value.length - 1];

    if (lastItem && typeof lastItem === "object") {
      const record = lastItem as Record<string, unknown>;

      return {
        name: toText(record.name),
        action: toText(record.action),
        publisher: toText(record.publisher),
        description: toText(record.description),
        link: getFirstLink(record),
      };
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      name: toText(record.name),
      action: toText(record.action),
      publisher: toText(record.publisher),
      description: toText(record.description),
      link: getFirstLink(record),
    };
  }

  return createEmptyProjectThreeDraft();
};
