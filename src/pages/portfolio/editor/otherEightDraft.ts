export type OtherEightDraft = {
  detail: string;
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

export const createEmptyOtherEightDraft = (): OtherEightDraft => ({
  detail: "",
});

export const createOtherEightDraft = (value: unknown): OtherEightDraft => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return {
      detail: toText((value as Record<string, unknown>).detail),
    };
  }

  return createEmptyOtherEightDraft();
};
