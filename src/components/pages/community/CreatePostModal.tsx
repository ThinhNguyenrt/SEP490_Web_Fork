import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  MapPin,
  Check,
  Plus,
  Contact,
} from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Khóa cuộn trang chính
      document.body.style.overflow = "hidden";
    } else {
      // Mở khóa khi đóng modal
      document.body.style.overflow = "unset";
    }

    // Cleanup function: Đảm bảo cuộn được khôi phục nếu component bị unmount bất ngờ
    return () => {
      document.body.style.overflow = "unset";
    };
    
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
          <h2 className="text-xl font-bold text-center w-full text-gray-900 ">
            Tạo bài viết
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 hover:bg-gray-100  rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              className="w-11 h-11 rounded-full object-cover"
              alt="Avatar"
            />
            <div>
              <p className="font-bold text-gray-900  text-sm">An Nhiên</p>
              <div className="bg-gray-100  px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase">
                Công khai
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            placeholder="Bạn đang nghĩ gì thế?"
            className="w-full min-h-[120px] text-lg bg-transparent border-none focus:ring-0 resize-none text-gray-800  outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Media Preview Area */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-gray-100  h-40"
                >
                  {file.type.startsWith("video/") ? (
                    <video
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200  rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50  transition-all"
              >
                <Plus size={24} />
                <span className="text-xs font-medium mt-1">Thêm ảnh/video</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Toolbar */}
        <div className="p-4">
          <div className="border border-gray-200  rounded-xl p-3 flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600  ml-1">
              Thêm vào bài viết
            </span>
            <div className="flex items-center gap-1">
              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-green-500 hover:bg-green-50  rounded-full transition-colors cursor-pointer"
                title="Ảnh/Video"
              >
                <ImageIcon size={24} />
              </button>
              <button
              onClick={() => fileInputRef.current?.click()}
                className="p-2 text-blue-500 hover:bg-blue-50  rounded-full transition-colors cursor-pointer"
                title="Video"
              >
                <Contact size={24} />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              console.log({ content, selectedFiles });
              onClose();
            }}
            disabled={!content.trim() && selectedFiles.length === 0}
            className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Đăng bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
