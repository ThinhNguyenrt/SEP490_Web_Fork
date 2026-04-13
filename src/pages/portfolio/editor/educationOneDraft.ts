export type EducationOneDraft = {
  schoolName: string;
  time: string;
  department: string;
  certificate: string;
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

const getEducationSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const firstItem = toRecordArray(value)[0];
    return firstItem ?? {};
  }

  return toRecord(value);
};

export const createEducationOneDraft = (value: unknown): EducationOneDraft => {
  const source = getEducationSource(value);

  return {
    schoolName: toText(source.schoolName ?? source.school),
    time: toText(source.time),
    department: toText(source.department ?? source.major),
    certificate: toText(source.certificate),
    description: toText(source.description),
  };
};
