export type CertificateOneDraft = {
  name: string;
  issuer: string;
  year: string;
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

const getCertificateSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const firstItem = toRecordArray(value)[0];
    return firstItem ?? {};
  }

  return toRecord(value);
};

export const createCertificateOneDraft = (value: unknown): CertificateOneDraft => {
  const source = getCertificateSource(value);

  return {
    name: toText(source.name),
    issuer: toText(source.issuer ?? source.provider),
    year: toText(source.year ?? source.date),
    link: toText(source.link),
  };
};
