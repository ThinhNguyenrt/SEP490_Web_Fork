export type ProjectOneDraft = {
  image: string;
  name: string;
  description: string;
  role: string;
  technology: string;
  githubLink: string;
  figmaLink: string;
  appLink: string;
  websiteLink: string;
};

type ParsedLink = {
  type: string;
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

const toLinkList = (value: unknown): ParsedLink[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => toRecord(item))
    .map((item) => ({
      type: toText(item.type).trim().toLowerCase(),
      link: toText(item.link).trim(),
    }))
    .filter((item) => item.link.length > 0);
};

const getProjectSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return toRecordArray(value)[0] ?? {};
  }

  return toRecord(value);
};

const resolveDraftLinks = (source: Record<string, unknown>): {
  githubLink: string;
  figmaLink: string;
  appLink: string;
  websiteLink: string;
} => {
  const links = [...toLinkList(source.projectLinks), ...toLinkList(source.links)];
  const usedIndexes = new Set<number>();

  const pickByType = (keywords: string[]): string => {
    for (let index = 0; index < links.length; index += 1) {
      if (usedIndexes.has(index)) {
        continue;
      }

      const currentType = links[index].type;
      const matched = keywords.some((keyword) => currentType.includes(keyword));
      if (!matched) {
        continue;
      }

      usedIndexes.add(index);
      return links[index].link;
    }

    return "";
  };

  const githubLink = pickByType(["github", "git", "repo", "source"]);
  const figmaLink = pickByType(["figma", "design", "prototype", "ui"]);
  const appLink = pickByType(["app", "play", "store", "mobile", "ios", "android"]);
  let websiteLink = pickByType(["website", "web", "site", "landing", "portfolio", "link"]);

  if (!websiteLink) {
    for (let index = 0; index < links.length; index += 1) {
      if (usedIndexes.has(index)) {
        continue;
      }

      websiteLink = links[index].link;
      break;
    }
  }

  return {
    githubLink,
    figmaLink,
    appLink,
    websiteLink,
  };
};

export const createProjectOneDraft = (value: unknown): ProjectOneDraft => {
  const source = getProjectSource(value);
  const linkFields = resolveDraftLinks(source);

  return {
    image: toText(source.image),
    name: toText(source.name),
    description: toText(source.description),
    role: toText(source.role),
    technology: toText(source.technology),
    ...linkFields,
  };
};
