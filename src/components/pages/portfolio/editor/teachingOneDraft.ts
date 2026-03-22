export type TeachingOneDraft = {
  subject: string;
  teachingplace: string;
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

export const createEmptyTeachingOneDraft = (): TeachingOneDraft => ({
  subject: "",
  teachingplace: "",
});

export const createTeachingOneDraft = (value: unknown): TeachingOneDraft => {
  if (Array.isArray(value)) {
    const firstItem = value[0];
    if (typeof firstItem === "object" && firstItem !== null) {
      const record = firstItem as Record<string, unknown>;
      return {
        subject: toText(record.subject),
        teachingplace: toText(record.teachingplace),
      };
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      subject: toText(record.subject),
      teachingplace: toText(record.teachingplace),
    };
  }

  return createEmptyTeachingOneDraft();
};
