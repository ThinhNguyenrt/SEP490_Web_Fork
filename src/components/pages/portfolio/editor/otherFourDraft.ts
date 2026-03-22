export type OtherFourDraft = {
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

export const createEmptyOtherFourDraft = (): OtherFourDraft => ({
  detail: "",
});

export const createOtherFourDraft = (value: unknown): OtherFourDraft => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return {
      detail: toText((value as Record<string, unknown>).detail),
    };
  }

  return createEmptyOtherFourDraft();
};
