export type TypicalCaseOneDraft = {
  patient: string;
  age: string;
  caseName: string;
  stage: string;
  regiment: string;
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

export const createEmptyTypicalCaseOneDraft = (): TypicalCaseOneDraft => ({
  patient: "",
  age: "",
  caseName: "",
  stage: "",
  regiment: "",
});

export const createTypicalCaseOneDraft = (value: unknown): TypicalCaseOneDraft => {
  if (Array.isArray(value)) {
    const firstItem = value[0];
    if (typeof firstItem === "object" && firstItem !== null) {
      const record = firstItem as Record<string, unknown>;
      return {
        patient: toText(record.patient),
        age: toText(record.age),
        caseName: toText(record.caseName),
        stage: toText(record.stage),
        regiment: toText(record.regiment),
      };
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      patient: toText(record.patient),
      age: toText(record.age),
      caseName: toText(record.caseName),
      stage: toText(record.stage),
      regiment: toText(record.regiment),
    };
  }

  return createEmptyTypicalCaseOneDraft();
};
