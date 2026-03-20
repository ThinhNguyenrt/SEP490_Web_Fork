export type ExperienceOneDraft = {
  jobName: string;
  address: string;
  time: string;
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

const getExperienceSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const firstItem = toRecordArray(value)[0];
    return firstItem ?? {};
  }

  return toRecord(value);
};

const composeTimeRange = (source: Record<string, unknown>): string => {
  const startDate = toText(source.startDate);
  const endDate = toText(source.endDate);
  const fallbackTime = toText(source.time);

  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  if (fallbackTime) {
    return fallbackTime;
  }

  return startDate || endDate;
};

export const splitExperienceOneTimeRange = (value: string): {
  startDate: string;
  endDate: string;
} => {
  const normalized = value.trim();
  if (!normalized) {
    return { startDate: "", endDate: "" };
  }

  const parts = normalized.split(/\s*[-–—]\s*/).filter((item) => item.length > 0);

  if (parts.length >= 2) {
    return {
      startDate: parts[0],
      endDate: parts.slice(1).join(" - "),
    };
  }

  return {
    startDate: normalized,
    endDate: normalized,
  };
};

export const createExperienceOneDraft = (value: unknown): ExperienceOneDraft => {
  const source = getExperienceSource(value);

  return {
    jobName: toText(source.jobName),
    address: toText(source.address),
    time: composeTimeRange(source),
    description: toText(source.description),
  };
};
