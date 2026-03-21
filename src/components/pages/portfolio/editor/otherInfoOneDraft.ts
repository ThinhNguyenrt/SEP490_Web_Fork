export type OtherInfoOneDraft = {
  interests: string[];
};

const normalizeInterest = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }

  return {};
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return normalizeInterest(value);
  }

  if (typeof value === "number") {
    return normalizeInterest(String(value));
  }

  return "";
};

const extractInterest = (item: unknown): string => {
  if (typeof item === "string" || typeof item === "number") {
    return toText(item);
  }

  const record = toRecord(item);
  return toText(record.detail ?? record.name ?? record.label);
};

const deduplicateInterests = (interests: string[]): string[] => {
  const used = new Set<string>();
  const nextInterests: string[] = [];

  interests.forEach((interestName) => {
    const normalized = normalizeInterest(interestName);
    if (!normalized) {
      return;
    }

    const key = normalized.toLowerCase();
    if (used.has(key)) {
      return;
    }

    used.add(key);
    nextInterests.push(normalized);
  });

  return nextInterests;
};

export const createOtherInfoOneDraft = (value: unknown): OtherInfoOneDraft => {
  if (!Array.isArray(value)) {
    return { interests: [] };
  }

  const interests = deduplicateInterests(value.map((item) => extractInterest(item)));
  return { interests };
};
