import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Smartphone,
  Database,
  Share2,
  Trash2,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyCenterPage() {
  const navigate = useNavigate();

  const privacyFeatures = [
    {
      icon: <Eye size={24} />,
      title: "Kiểm soát khả năng hiển thị",
      description: "Quản lý ai có thể nhìn thấy thông tin và bài viết của bạn",
    },
    {
      icon: <Lock size={24} />,
      title: "Bảo mật tài khoản",
      description: "Kích hoạt xác thực hai yếu tố và quản lý phiên đăng nhập",
    },
    {
      icon: <Share2 size={24} />,
      title: "Chia sẻ dữ liệu",
      description: "Kiểm soát cách chia sẻ dữ liệu của bạn với các ứng dụng thứ ba",
    },
    {
      icon: <Database size={24} />,
      title: "Dữ liệu cá nhân",
      description: "Xem và tải xuống tất cả dữ liệu cá nhân của bạn",
    },
    {
      icon: <Smartphone size={24} />,
      title: "Hoạt động thiết bị",
      description: "Xem các thiết bị đã đăng nhập vào tài khoản của bạn",
    },
    {
      icon: <Trash2 size={24} />,
      title: "Xóa dữ liệu",
      description: "Xóa vĩnh viễn dữ liệu hoặc tài khoản của bạn",
    },
  ];

  const privacySettings = [
    {
      title: "Ai có thể tìm kiếm tôi?",
      options: ["Mọi người", "Chỉ bạn bè", "Không ai"],
      description: "Kiểm soát ai có thể tìm tài khoản của bạn",
    },
    {
      title: "Ai có thể liên hệ với tôi?",
      options: ["Mọi người", "Chỉ bạn bè", "Không ai"],
      description: "Quản lý các yêu cầu liên hệ và tin nhắn",
    },
    {
      title: "Hồ sơ của tôi là công khai hay riêng tư?",
      options: ["Công khai", "Riêng tư"],
      description: "Chọn ai có thể xem hồ sơ đầy đủ của bạn",
    },
    {
      title: "Tôi có muốn nhận email tiếp thị không?",
      options: ["Có", "Không"],
      description: "Kiểm soát các email quảng cáo và tiếp thị",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Trung tâm quyền riêng tư
          </h1>
        </div>

        {/* Shield Banner */}
        <Card className="border-2 border-blue-200 bg-blue-50 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-start gap-4">
            <Shield size={32} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 text-lg mb-1">
                Chúng tôi bảo vệ quyền riêng tư của bạn
              </h3>
              <p className="text-blue-800 text-sm">
                SkillSnap cam kết bảo vệ dữ liệu cá nhân của bạn. Bạn luôn có
                quyền kiểm soát thông tin của mình.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Công cụ kiểm soát quyền riêng tư
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacyFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-slate-200 shadow-sm rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Cài đặt quyền riêng tư của tôi
          </h2>

          <div className="space-y-3">
            {privacySettings.map((setting, index) => (
              <Card
                key={index}
                className="border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base mb-2">
                      {setting.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {setting.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {setting.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border-2 ${
                          optIndex === 0
                            ? "border-blue-500 bg-blue-100 text-blue-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Rights Section */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Settings size={24} className="text-slate-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <h3 className="font-bold text-slate-800 text-base">
                  Quyền của bạn đối với dữ liệu
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>Quyền truy cập:</strong> Bạn có thể yêu cầu sao
                      chép dữ liệu của mình bất cứ lúc nào
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>Quyền chỉnh sửa:</strong> Bạn có thể cập nhật hoặc
                      sửa thông tin cá nhân của mình
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>Quyền xóa:</strong> Bạn có thể yêu cầu xóa dữ liệu
                      của mình
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>
                      <strong>Quyền từ chối:</strong> Bạn có thể từ chối xử lý
                      dữ liệu cho các mục đích nhất định
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-2xl bg-slate-50">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-slate-700 font-medium">
              Bạn có thắc mắc về quyền riêng tư?
            </p>
            <p className="text-slate-600 text-sm">
              Liên hệ đội hỗ trợ của chúng tôi tại support@skillsnap.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
