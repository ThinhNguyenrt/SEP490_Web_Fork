import React from "react";
import { useNavigate } from "react-router-dom";
// 1. Dữ liệu giả lập cho các thẻ giá trị (để code gọn sạch hơn)
const valueCards = [
  {
    iconUrl: "/src/assets/landing-page-value-1.png", // Thay bằng đường dẫn ảnh icon profile của bạn
    title: "Xây dựng hồ sơ ấn tượng",
    description:
      "Dễ dàng tạo và tùy chỉnh hồ sơ thể hiện toàn bộ kĩ năng và các dự án tâm đắc của bạn",
  },
  {
    iconUrl: "/src/assets/landing-page-value-2.png", // Thay bằng đường dẫn ảnh icon phân tích
    title: "Phân tích tiến độ",
    description:
      "Theo dõi sự phát triển kĩ năng của bạn qua thời gian với các báo cáo trực quan và chi tiết",
  },
  {
    iconUrl: "/src/assets/landing-page-value-3.png", // Thay bằng đường dẫn ảnh icon cặp táp
    title: "Khám phá cơ hội",
    description:
      "Tiếp cận các cơ hội việc làm, dự án và hợp tác phù hợp nhất với bộ kĩ năng của bạn",
  },
];

// 2. Component nhỏ cho mỗi thẻ giá trị
const ValueCard: React.FC<{
  iconUrl: string;
  title: string;
  description: string;
}> = ({ iconUrl, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-xl">
    <div className="mb-6 p-4 bg-slate-50 rounded-full border border-slate-100">
      <img src={iconUrl} alt={title} className="w-12 h-12 object-contain" />
    </div>
    <h3 className="text-xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
      {description}
    </p>
  </div>
);

// 3. Component Section Giá Trị hoàn chỉnh
const ValuesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight text-slate-950">
            Những giá trị SkillSnap mang lại
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Khám phá các công cụ mạnh mẽ giúp bạn thể hiện kĩ năng và thúc đẩy
            sự nghiệp
          </p>
        </div>

        {/* Lưới các thẻ giá trị */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {valueCards.map((card, index) => (
            <ValueCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PHẦN 2: SECTION HÀNH TRÌNH (TIMELINE) ---

const journeySteps = [
  {
    number: 1,
    title: "Tạo hồ sơ",
    description:
      "Đăng kí tài khoản và điền các thông tin cơ bản để bắt đầu xây dựng hồ sơ kỹ năng của bạn",
  },
  {
    number: 2,
    title: "Thêm kĩ năng & dự án",
    description:
      "Liệt kê các kĩ năng bạn có, thêm các dự án đã thực hiện kèm minh chứng cụ thể",
  },
  {
    number: 3,
    title: "Nhận đánh giá",
    description:
      "Được hệ thống đánh giá và xác thực các kỹ năng của bạn bằng AI chuyên nghiệp",
  },
  {
    number: 4,
    title: "Chia sẻ & kết nối",
    description:
      "Chia sẻ hồ sơ của bạn với nhà tuyển dụng và cộng đồng để tìm kiếm cơ hội mới",
  },
];

const JourneySection: React.FC = () => {
  return (
    <section className="py-8 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            Hành trình phát triển kĩ năng của bạn
          </h2>
          <p className="text-slate-500 text-lg">
            Bắt đầu hành trình của bạn với 4 bước đơn giản cùng SkillSnap
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Trục kẻ dọc ở giữa */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-20">
            {journeySteps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className="relative flex md:justify-center items-center w-full"
                >
                  {/* Container cho nội dung - Chia làm 2 cột bằng nhau */}
                  <div
                    className={`flex w-full items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Cột chứa Content */}
                    <div
                      className={`w-full md:w-1/2 flex ${isLeft ? "md:justify-end md:pr-12" : "md:justify-start md:pl-12"}`}
                    >
                      <div className="flex items-start gap-4 max-w-md">
                        {/* Số thứ tự - Luôn nằm bên trái của Tiêu đề/Mô tả */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                          {step.number}
                        </div>

                        {/* Text: Tiêu đề + Mô tả */}
                        <div className="pt-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cột trống đối diện để tạo khoảng trống zic-zac */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
// --- SECTION 1: APP DOWNLOAD ---
const AppDownloadSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">
          {/* Cột bên trái: Nội dung & Nút tải */}
          <div className="p-10 md:p-16 flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Ứng dụng SkillSnap <br /> kết nối mọi lúc mọi nơi
            </h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-xl">
              Với ứng dụng di động SkillSnap, bạn có thể dễ dàng cập nhật hồ sơ,
              theo dõi tiến độ kĩ năng và kết nối với mạng lưới chuyên nghiệp
              ngay trên điện thoại. Đừng bỏ lỡ bất kì cơ hội nào, dù bạn ở bất
              kì đâu.
            </p>

            {/* Nút tải Android */}
            <button className="bg-[#1a1f26] text-white px-6 py-4 rounded-xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
              <img
                src="https://www.vectorlogo.zone/logos/android/android-icon.svg"
                alt="Android logo"
                className="w-8 h-8"
              />
              <div className="text-left">
                <span className="block text-sm opacity-80">
                  Tải xuống ứng dụng cho Android
                </span>
              </div>
            </button>
          </div>

          {/* Cột bên phải: Hình ảnh Mockup (Màu vàng cam) */}
          <div className="w-full md:w-[40%] h-full min-h-[400px] flex items-center justify-center p-12">
            <div className="relative w-full max-w-[220px]">
              {/* Hình ảnh giả lập màn hình điện thoại */}
              <img
                src="/src/assets/landing-page-phone.png"
                alt="SkillSnap App Mockup"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const Footer: React.FC = () => {
  // Dữ liệu cho các cột footer để code gọn hơn
  const footerLinks = [
    {
      title: "Sản phẩm",
      links: ["Tính năng", "Giá cả", "Cập nhật"],
    },
    {
      title: "Công ty",
      links: ["Về chúng tôi", "Tuyển dụng", "Blog"],
    },
    {
      title: "Chính sách",
      links: ["Điều khoản", "Bảo mật", "Hỗ trợ"],
    },
    {
      title: "Liên hệ",
      links: ["Báo lỗi", "Tư vấn"],
    },
  ];

  return (
    <footer className="bg-[#f8f9fa] pt-16 pb-8 px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Phần trên: Logo và các Cột link */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Cột 1: Logo và Slogan (Chiếm 4/12 cột trên desktop) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col items-start gap-1">
              <img
                src="/product-logo.png"
                alt="SkillSnap Logo"
                className="h-14 w-auto object-contain"
              />
              <span className="font-bold text-xl text-slate-900">
                SkillSnap
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
              Nền tảng biến kỹ năng của bạn thành cơ hội
            </p>
          </div>

          {/* Các cột Link (Chiếm 8/12 cột còn lại) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="font-bold text-slate-900 mb-5 text-lg">
                  {column.title}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-blue-600 transition-colors text-sm md:text-base"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Đường kẻ ngang ngăn cách */}
        <div className="border-t border-slate-300 pt-8 mt-8">
          <p className="text-slate-500 text-sm">
            Sản phẩm đã được đăng ký bản quyền sở hữu trí tuệ
          </p>
        </div>
      </div>
    </footer>
  );
};
// --- SECTION 2: CALL TO ACTION (CTA) ---
const CallToActionSection: React.FC = () => {
  return (
    <section className="pb-24 px-4">
      <div className="max-w-6xl mx-auto bg-[#4285f4] rounded-2xl py-16 px-6 text-center text-white shadow-2xl shadow-blue-200">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Sẵn sàng để kĩ năng của bạn tỏa sáng
        </h2>
        <p className="text-blue-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Tham gia cộng đồng SkillSnap ngay hôm nay và bắt đầu xây dựng tương
          lai sự nghiệp của bạn
        </p>

        <button className="bg-white text-[#4285f4] font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105">
          Bắt đầu miễn phí ngay
        </button>
      </div>
    </section>
  );
};
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-900 bg-white">
      <main>
        {/* 2. Hero Section */}
        <section className="py-8 px-4 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            SkillSnap - Nền tảng biến kĩ năng <br /> của bạn thành cơ hội
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cung cấp các công cụ mạnh mẽ để bạn xây dựng, quản lý và
            chia sẻ portfolio kỹ năng một cách chuyên nghiệp, giúp bạn nổi bật
            trong mắt nhà tuyển dụng và mở ra những cánh cửa sự nghiệp mới.
          </p>

          {/* Image Placeholder - Thay src bằng link ảnh thực tế của bạn */}
          <div className="mt-12 rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <img
              src="/src/assets/landing-page-img.png"
              alt="Skills Visualization"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* 3. Mission Section */}
        <section className="bg-[#EFF6FF] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-slate-600 text-lg leading-loose">
              SkillSnap ra đời với sứ mệnh trao quyền cho mỗi cá nhân, giúp họ
              nhận diện, phát triển và trình bày các kỹ năng của mình một cách
              hiệu quả nhất. Chúng tôi tin rằng ai cũng có những tài năng riêng,
              và việc thể hiện chúng một cách rõ ràng chính là chìa khóa để nắm
              bắt cơ hội và thành công trong sự nghiệp.
            </p>
          </div>
        </section>

        {/* 4. Values Section */}
        <ValuesSection />

        {/* 5. Journey Section */}
        <JourneySection />
        <AppDownloadSection />
        <CallToActionSection />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
