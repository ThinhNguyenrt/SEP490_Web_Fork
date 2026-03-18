import React from 'react';
import CertificateIcon from '../../../../assets/myWeb/certificate 2.png';
import ProfileIcon from '../../../../assets/myWeb/profile1 1.png';

type LicenseCardData = {
  title: string;
  licenseNumber: string;
  issuer: string;
  status: string;
};

interface OtherEightProps {
  data: unknown;
}

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const normalizeLicenseData = (data: unknown): LicenseCardData => {
  const fallback: LicenseCardData = {
    title: 'GIẤY PHÉP HÀNH NGHỀ',
    licenseNumber: '001234/BYT - CCHN',
    issuer: 'Bộ Y Tế Việt Nam',
    status: 'Có hiệu lực',
  };

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const detail = typeof record.detail === 'string' ? record.detail.trim() : '';
  const detailAsText = detail && !isUrl(detail) ? detail : '';

  const title =
    typeof record.title === 'string' && record.title.trim()
      ? record.title.trim()
      : typeof record.name === 'string' && record.name.trim()
        ? record.name.trim()
        : fallback.title;

  const licenseNumber =
    typeof record.licenseNumber === 'string' && record.licenseNumber.trim()
      ? record.licenseNumber.trim()
      : typeof record.certificateNumber === 'string' && record.certificateNumber.trim()
        ? record.certificateNumber.trim()
        : typeof record.code === 'string' && record.code.trim()
          ? record.code.trim()
          : detailAsText || fallback.licenseNumber;

  const issuer =
    typeof record.issuer === 'string' && record.issuer.trim()
      ? record.issuer.trim()
      : typeof record.provider === 'string' && record.provider.trim()
        ? record.provider.trim()
        : typeof record.organization === 'string' && record.organization.trim()
          ? record.organization.trim()
          : fallback.issuer;

  const status =
    typeof record.status === 'string' && record.status.trim()
      ? record.status.trim()
      : typeof record.state === 'string' && record.state.trim()
        ? record.state.trim()
        : fallback.status;

  return {
    title,
    licenseNumber,
    issuer,
    status,
  };
};

const OtherEight: React.FC<OtherEightProps> = ({ data }) => {
  const license = normalizeLicenseData(data);

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div
        className="rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(108deg, #111B34 0%, #0A1738 55%, #101B34 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={CertificateIcon} alt="Giấy phép" className="w-8 h-8 shrink-0" />
            <h3 className="text-xl font-bold text-slate-200 truncate">{license.title}</h3>
          </div>

          <img src={ProfileIcon} alt="Thẻ nhận diện" className="w-20 h-20 opacity-20 shrink-0" />
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-base text-slate-400">Số chứng chỉ</p>
            <p className="mt-1 text-2xl font-bold tracking-wide text-white">{license.licenseNumber}</p>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-base text-slate-400">Nơi cấp</p>
              <p className="mt-1 text-2xl font-semibold text-slate-200">{license.issuer}</p>
            </div>

            <span className="rounded-lg border border-slate-500 bg-slate-700/30 px-4 py-2 text-lg font-semibold text-slate-200 shrink-0">
              {license.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherEight;