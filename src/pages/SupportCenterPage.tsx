import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupportCenterPage() {
  const navigate = useNavigate();

  const faqs = [
    {
      id: 1,
      category: "Tài khoản",
      question: "Làm cách nào để đặt lại mật khẩu của tôi?",
      answer:
        "Bạn có thể đặt lại mật khẩu bằng cách vào phần Cài đặt & hỗ trợ, chọn 'Đổi mật khẩu' và làm theo hướng dẫn.",
    },
    {
      id: 2,
      category: "Tài khoản",
      question: "Tôi quên email đăng ký của mình. Tôi nên làm gì?",
      answer:
        "Vui lòng liên hệ với đội hỗ trợ khách hàng của chúng tôi qua email hoặc điện thoại để được trợ giúp.",
    },
    {
      id: 3,
      category: "Hồ sơ",
      question: "Làm cách nào để cập nhật hồ sơ của tôi?",
      answer:
        "Vào trang Hồ sơ cá nhân, click nút 'Quản lý hồ sơ' để truy cập và chỉnh sửa thông tin của bạn.",
    },
    {
      id: 4,
      category: "Hồ sơ",
      question: "Tôi có thể xóa hồ sơ của mình không?",
      answer:
        "Có thể. Để xóa tài khoản hoặc hồ sơ, hãy liên hệ với đội hỗ trợ khách hàng của chúng tôi.",
    },
    {
      id: 5,
      category: "Ứng tuyển",
      question: "Làm cách nào để theo dõi trạng thái ứng tuyển của tôi?",
      answer:
        "Bạn có thể xem trạng thái ứng tuyển của mình từ trang 'Quản lí ứng tuyển' trong phần dịch vụ chính.",
    },
    {
      id: 6,
      category: "Ứng tuyển",
      question: "Tôi có thể rút lại ứng tuyển của mình không?",
      answer:
        "Có, bạn có thể rút lại ứng tuyển từ trang 'Quản lí ứng tuyển' bằng cách click nút 'Rút lại'.",
    },
  ];

  const supportChannels = [
    {
      icon: <MessageCircle size={24} />,
      title: "Chat trực tiếp",
      description: "Trò chuyện với đội hỗ trợ của chúng tôi",
      time: "Hoạt động: 8:00 - 20:00 hàng ngày",
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      description: "support@skillsnap.com",
      time: "Phản hồi trong vòng 24 giờ",
    },
    {
      icon: <Phone size={24} />,
      title: "Điện thoại",
      description: "1900 1234",
      time: "Hoạt động: 8:00 - 18:00 từ Thứ 2-6",
    },
    {
      icon: <FileText size={24} />,
      title: "Trình Tạo Ticket",
      description: "Tạo yêu cầu hỗ trợ chi tiết",
      time: "Trạng thái cập nhật thời gian thực",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Trung tâm hỗ trợ</h1>
        </div>

        {/* Support Channels */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Hãy liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className="border-2 border-slate-200 shadow-sm rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200 text-blue-600">
                    {channel.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {channel.title}
                    </h3>
                    <p className="text-slate-600 font-medium text-sm">
                      {channel.description}
                    </p>
                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                      <Clock size={12} /> {channel.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Các câu hỏi thường gặp
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card
                key={faq.id}
                className="border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-blue-300 transition-all"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Tip Banner */}
        <Card className="border-2 border-amber-200 bg-amber-50 shadow-sm rounded-2xl">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-base mb-1">
                Mẹo: Tìm kiếm nhanh
              </h3>
              <p className="text-amber-800 text-sm">
                Không tìm thấy câu trả lời bạn cần? Hãy thử tìm kiếm các từ khóa
                liên quan hoặc liên hệ trực tiếp với đội hỗ trợ của chúng tôi
                qua các kênh trên.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
