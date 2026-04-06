import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TermsPolicyPage() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      id: 1,
      title: "1. Điều khoản Dịch vụ",
      icon: <FileText size={20} />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>1.1 Chấp nhận Điều khoản</strong>
          </p>
          <p>
            Bằng cách truy cập và sử dụng SkillSnap, bạn đồng ý tuân thủ các
            điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng
            không sử dụng dịch vụ.
          </p>

          <p>
            <strong>1.2 Giấy phép Sử dụng</strong>
          </p>
          <p>
            SkillSnap cấp cho bạn giấy phép sử dụng không độc quyền, không có
            thể chuyển nhượng để truy cập và sử dụng nền tảng cho mục đích cá
            nhân hoặc kinh doanh.
          </p>

          <p>
            <strong>1.3 Hạn chế</strong>
          </p>
          <p>
            Bạn không được: sao chép, sửa đổi hoặc phân phối nội dung từ
            SkillSnap mà không được phép; sử dụng SkillSnap cho mục đích bất
            hợp pháp; hoặc cố gắng hack hoặc phá vỡ bảo mật dịch vụ.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. Chính sách Bảo mật",
      icon: <Shield size={20} />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>2.1 Thông tin Chúng tôi Thu thập</strong>
          </p>
          <p>
            Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp (như hồ sơ)
            và thông tin được thu thập tự động (như cookie, địa chỉ IP).
          </p>

          <p>
            <strong>2.2 Cách Chúng tôi Sử dụng Thông tin</strong>
          </p>
          <p>
            Dữ liệu của bạn được sử dụng để cung cấp dịch vụ, cải thiện nền
            tảng, và gửi cập nhật. Chúng tôi không bao giờ bán dữ liệu cá nhân
            của bạn cho bên thứ ba.
          </p>

          <p>
            <strong>2.3 Bảo vệ Dữ liệu</strong>
          </p>
          <p>
            Chúng tôi sử dụng mã hóa SSL và các biện pháp bảo mật khác để bảo
            vệ thông tin của bạn.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. Chính sách Nội dung Người dùng",
      icon: <Users size={20} />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>3.1 Sở hữu Nội dung</strong>
          </p>
          <p>
            Bạn giữ quyền sở hữu tất cả nội dung bạn đăng lên SkillSnap. Bằng
            cách đăng nội dung, bạn cấp SkillSnap được phép hiển thị và chia
            sẻ nó.
          </p>

          <p>
            <strong>3.2 Nội dung Cấm</strong>
          </p>
          <p>
            Bạn không được đăng nội dung là: bạo lực, quấy rối, phân biệt đối
            xử, hoặc vi phạm bản quyền. SkillSnap có quyền xóa nội dung vi
            phạm.
          </p>

          <p>
            <strong>3.3 Cộng đồng Có trách nhiệm</strong>
          </p>
          <p>
            Chúng tôi khuyến khích sử dụng SkillSnap một cách có trách nhiệm và
            tôn trọng các thành viên khác.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Chính sách Hủy bỏ & Hoàn tiền",
      icon: <Zap size={20} />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>4.1 Gói Premium</strong>
          </p>
          <p>
            Các gói Premium được tái gia hạn tự động hàng tháng trừ khi bạn hủy.
          </p>

          <p>
            <strong>4.2 Hủy bỏ Dịch vụ</strong>
          </p>
          <p>
            Bạn có thể hủy gói Premium bất kỳ lúc nào từ cài đặt tài khoản. Hủy
            bỏ sẽ có hiệu lực từ kỳ hạn tiếp theo.
          </p>

          <p>
            <strong>4.3 Hoàn tiền</strong>
          </p>
          <p>
            Vui lòng liên hệ đội hỗ trợ của chúng tôi để yêu cầu hoàn tiền trong
            vòng 30 ngày từ ngày mua.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. Khước từ Trách nhiệm",
      icon: <AlertCircle size={20} />,
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong>5.1 Dịch vụ Được cung cấp Như hiện tại</strong>
          </p>
          <p>
            SkillSnap được cung cấp "như hiện tại" mà không có bất kỳ đảm bảo
            nào. Chúng tôi không chịu trách nhiệm về bất kỳ tổn hại nào phát
            sinh từ việc sử dụng dịch vụ.
          </p>

          <p>
            <strong>5.2 Hạn chế Trách nhiệm</strong>
          </p>
          <p>
            Trong mọi trường hợp, SkillSnap sẽ không chịu trách nhiệm về bất kỳ
            tổn hại gián tiếp hoặc hậu quả nào.
          </p>
        </div>
      ),
    },
  ];

  const legalInfo = [
    {
      title: "Thay đổi Điều khoản",
      description:
        "SkillSnap có quyền thay đổi các điều khoản này bất cứ lúc nào. Thay đổi sẽ có hiệu lực khi được đăng tải.",
    },
    {
      title: "Pháp luật Áp dụng",
      description:
        "Các điều khoản này được điều chỉnh bởi các luật của Việt Nam và bạn đồng ý chịu sự quản辖của các tòa án ở Việt Nam.",
    },
    {
      title: "Liên hệ Pháp chế",
      description:
        "Nếu bạn có thắc mắc về các điều khoản này, vui lòng liên hệ legal@skillsnap.com",
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
            Điều khoản & Chính sách
          </h1>
        </div>

        {/* Intro Card */}
        <Card className="border-2 border-blue-200 bg-blue-50 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-2">
            <p className="text-slate-800 font-bold">
              Vui lòng đọc kỹ các điều khoản và chính sách này
            </p>
            <p className="text-slate-700 text-sm">
              Bằng cách sử dụng SkillSnap, bạn đồng ý tuân thủ tất cả các điều
              khoản, điều kiện và chính sách được nêu dưới đây.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-blue-300 transition-all"
            >
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )
                }
                className="w-full p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-blue-600">{section.icon}</div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {section.title}
                    </h3>
                  </div>
                  <div
                    className={`text-slate-400 transition-transform ${
                      expandedSection === section.id ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>

              {expandedSection === section.id && (
                <CardContent className="p-6 border-t-2 border-slate-100 bg-slate-50">
                  {section.content}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Legal Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Thông tin Pháp chế Khác
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {legalInfo.map((info, index) => (
              <Card
                key={index}
                className="border-2 border-slate-200 shadow-sm rounded-2xl"
              >
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-500 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">
                        {info.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-2xl bg-slate-50">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 text-sm">
              Lần cập nhật gần nhất: Tháng 4, 2026
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Các thay đổi có thể được thực hiện mà không cần thông báo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
