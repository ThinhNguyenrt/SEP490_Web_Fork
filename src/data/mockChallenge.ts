import { Challenge } from "@/types/challenge";

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    companyId: 1,
    title: "Frontend React Challenge 2024",
    description:
      "Xây dựng một ứng dụng React hoàn chỉnh với các chức năng: quản lý công việc, tìm kiếm, lọc dữ liệu và tích hợp API. Yêu cầu: TypeScript, Tailwind CSS, Redux hoặc Zustand.",
    startDate: "2024-06-01T00:00:00Z",
    endDate: "2024-06-30T23:59:59Z",
    reward: "50,000,000 VNĐ + Job offer",
    status: "active",
    createdAt: "2024-05-15T10:30:00Z",
    updatedAt: "2024-05-15T10:30:00Z",
  },
  {
    id: 2,
    companyId: 1,
    title: "Backend Node.js API Development",
    description:
      "Phát triển REST API sử dụng Node.js và Express. Bao gồm xác thực, phân quyền, xử lý lỗi và viết test. Database: MongoDB hoặc PostgreSQL.",
    startDate: "2024-07-01T00:00:00Z",
    endDate: "2024-07-31T23:59:59Z",
    reward: "60,000,000 VNĐ + 3 tháng internship",
    status: "inactive",
    createdAt: "2024-05-10T14:20:00Z",
    updatedAt: "2024-05-10T14:20:00Z",
  },
  {
    id: 3,
    companyId: 1,
    title: "Mobile App Development - iOS/Android",
    description:
      "Phát triển ứng dụng di động đa nền tảng sử dụng React Native hoặc Flutter. Ứng dụng phải có UI đẹp, hiệu năng tốt và trải nghiệm người dùng mượt mà.",
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2024-08-31T23:59:59Z",
    reward: "70,000,000 VNĐ + Job offer + Bonus",
    status: "inactive",
    createdAt: "2024-05-05T09:15:00Z",
    updatedAt: "2024-05-05T09:15:00Z",
  },
  {
    id: 4,
    companyId: 1,
    title: "Data Science & Machine Learning",
    description:
      "Xây dựng mô hình ML để dự đoán giá nhà. Sử dụng Python, pandas, scikit-learn. Yêu cầu chuẩn bị dữ liệu, train model, evaluate và deploy.",
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-09-30T23:59:59Z",
    reward: "80,000,000 VNĐ",
    status: "inactive",
    createdAt: "2024-04-28T16:45:00Z",
    updatedAt: "2024-04-28T16:45:00Z",
  },
  {
    id: 5,
    companyId: 1,
    title: "DevOps & Cloud Infrastructure",
    description:
      "Thiết lập và quản lý infrastructure trên AWS/Azure/GCP. Bao gồm CI/CD pipeline, containerization với Docker/Kubernetes, monitoring và logging.",
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-10-31T23:59:59Z",
    reward: "75,000,000 VNĐ",
    status: "inactive",
    createdAt: "2024-04-20T11:00:00Z",
    updatedAt: "2024-04-20T11:00:00Z",
  },
];
