export type ProjectTwoDraft = {
  name: string;
  action: string;
  publisher: string;
  description: string;
  link: string;
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

const getFirstLink = (source: Record<string, unknown>): string => {
  const projectLinks = Array.isArray(source.projectLinks) ? source.projectLinks : [];
  const links = Array.isArray(source.links) ? source.links : [];

  for (const item of [...projectLinks, ...links]) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const link = toText((item as Record<string, unknown>).link).trim();
    if (link) {
      return link;
    }
  }

  return "";
};

const getProjectTwoSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const items = toRecordArray(value);
    return items[items.length - 1] ?? {};
  }

  return toRecord(value);
};

export const createEmptyProjectTwoDraft = (): ProjectTwoDraft => ({
  name: "",
  action: "",
  publisher: "",
  description: "",
  link: "",
});

export const createProjectTwoDraft = (value: unknown): ProjectTwoDraft => {
  const source = getProjectTwoSource(value);

  return {
    name: toText(source.name),
    action: toText(source.action),
    publisher: toText(source.publisher),
    description: toText(source.description),
    link: getFirstLink(source),
  };
};
