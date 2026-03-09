import React, { useState, useEffect, useRef } from "react";
import {
  X, Image as ImageIcon, Send, Info, MapPin, Briefcase,
  Banknote, ChevronDown, FileText, AlertCircle, Star, Gift, CloudUpload
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Component dùng chung cho các ô Rich Text
const RichEditorGroup = ({ label, value, onChange, icon: Icon, color, placeholder }: any) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "bullet" }, { list: "ordered" }],
      ["clean"],
    ],
  };

  return (
    <div className={`p-5 bg-white rounded-2xl border border-slate-200  transition-all shadow-sm`}>
      <div className={`flex items-center gap-2 mb-3 text-${color}-600 dark:text-${color}-400`}>
        <Icon size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="quill-standard quill-row-3">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          className="text-sm"
        />
      </div>
    </div>
  );
};

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateJobModal = ({ isOpen, onClose }: CreateJobModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State cho các nội dung dài
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [priorities, setPriorities] = useState("");
  const [benefits, setBenefits] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      {/* Modal Container */}
      <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Tạo thông tin tuyển dụng</h2>
              <p className="text-xs text-slate-500 mt-1">Điền đầy đủ các thông tin bên dưới</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body (1 Cột Duy Nhất) */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
          
          {/* Section 1: Media */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-600" /> Hình ảnh & Video
            </h3>
            <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-12 bg-white dark:bg-slate-900 hover:border-blue-500 cursor-pointer transition-all group shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <CloudUpload className="text-blue-600" size={32} />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-bold">Tải lên Banner tuyển dụng</p>
              <p className="text-slate-500 text-xs mt-1">Kéo và thả hoặc nhấp để chọn tệp</p>
              <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" />
            </div>
          </section>

          {/* Section 2: Basic Info */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info size={18} className="text-blue-600" /> Thông tin cơ bản
            </h3>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vị trí tuyển dụng *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none focus:border-blue-500 text-sm transition-all" placeholder="VD: Senior Frontend Developer" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mức lương</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none focus:border-blue-500 text-sm transition-all" placeholder="15 - 25tr" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Địa điểm làm việc</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none focus:border-blue-500 text-sm transition-all" placeholder="Nhập địa chỉ làm việc..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hình thức</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none text-sm appearance-none focus:border-blue-500">
                      <option>Toàn thời gian</option>
                      <option>Remote</option>
                      <option>Part-time</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kinh nghiệm</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none text-sm focus:border-blue-500" placeholder="VD: 2-3 năm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Số lượng</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 outline-none text-sm focus:border-blue-500" placeholder="1" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Rich Text Editors */}
          <section className="space-y-6 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Nội dung chi tiết
            </h3>
            
            <RichEditorGroup label="Mô tả công việc" value={description} onChange={setDescription} icon={FileText} color="black" placeholder="Nêu rõ các nhiệm vụ chính..." />
            
            <RichEditorGroup label="Yêu cầu bắt buộc" value={requirements} onChange={setRequirements} icon={AlertCircle} color="red" placeholder="Kỹ năng, chứng chỉ không thể thiếu..." />
            
            <RichEditorGroup label="Ưu tiên (Điểm cộng)" value={priorities} onChange={setPriorities} icon={Star} color="blue" placeholder="Các kỹ năng bổ trợ là lợi thế..." />
            
            <RichEditorGroup label="Quyền lợi & đãi ngộ" value={benefits} onChange={setBenefits} icon={Gift} color="emerald" placeholder="Chế độ bảo hiểm, thưởng, du lịch..." />
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-3xl flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Hủy bỏ</button>
          <button className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            Đăng tuyển dụng <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;