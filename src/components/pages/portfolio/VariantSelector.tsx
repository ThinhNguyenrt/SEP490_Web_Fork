import React, { useState } from "react";
import { X } from "lucide-react";
import { BlockInfo } from "./blockCatalog";
import { VariantPreviewGrid } from "./VariantPreviewGrid";

interface VariantSelectorProps {
  blockInfo: BlockInfo;
  onSelectVariant: (variant: string) => void;
  onClose: () => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  blockInfo,
  onSelectVariant,
  onClose,
}) => {
  const Icon = blockInfo.icon;
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const handleSelectVariant = (variant: string) => {
    setSelectedVariant(variant);
  };

  const handleConfirm = () => {
    if (selectedVariant) {
      onSelectVariant(selectedVariant);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Icon size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{blockInfo.label}</h2>
              <p className="text-xs text-slate-500">{blockInfo.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Chọn kiểu hiển thị để xem preview:
          </p>
          <VariantPreviewGrid
            blockInfo={blockInfo}
            selectedVariant={selectedVariant}
            onSelectVariant={handleSelectVariant}
          />
          {selectedVariant && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700">
                ✓ Đã chọn: <span className="font-semibold">{blockInfo.variants.find(v => v.variant === selectedVariant)?.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedVariant}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;
