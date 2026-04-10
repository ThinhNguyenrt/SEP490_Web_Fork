import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Common
import { WebLayout } from "./components/common/WebLayout";
import LoadingWrapper from "./components/Loading/LoadingWrapper";

// Services & Store
import { realtimeService } from "./services/realtimeService";
import { useAppSelector } from "./store/hook";
import { notify } from "./lib/toast";
import { useUserProfile } from "./hook/useUserProfile";

// --- CHUYỂN SANG LAZY LOAD CHO CÁC PAGES ---
const LoginPage = lazy(() => import("./components/pages/login/Login"));
const ProfilePage = lazy(() => import("./components/pages/profile/Profile"));
const RecruiterProfile = lazy(
  () => import("./components/pages/recruiter/profile/RecruiterProfile"),
);
const PortfolioManagement = lazy(
  () => import("./components/pages/portfolio/PortfolioManagement"),
);
const EmptyPortfolioPage = lazy(
  () => import("./components/pages/portfolio/EmptyPortfolio"),
);
const CreatePortfolio = lazy(
  () => import("./components/pages/portfolio/CreatePortfolio"),
);
const EditPortfolio = lazy(
  () => import("./components/pages/portfolio/EditPortfolio"),
);
const TalentHome = lazy(() => import("./components/pages/talent/TalentHome"));
const RecruiterHome = lazy(
  () => import("./components/pages/recruiter/home/RecruiterHome"),
);
const RecruitmentManagement = lazy(
  () =>
    import("./components/pages/recruiter/recruitment/RecruitmentManagement"),
);
const CreateRecruitmentPost = lazy(
  () =>
    import("./components/pages/recruiter/recruitment/CreateRecruitmentPost"),
);
const RecruitmentDetails = lazy(
  () => import("./components/pages/recruiter/recruitment/RecruitmentDetails"),
);
const PostDetail = lazy(() =>
  import("./components/pages/talent/PostDetail").then((module) => ({
    default: module.PostDetail,
  })),
);
const ChatRoom = lazy(() => import("./components/pages/talent/ChatRoom"));
const ApplicationHistory = lazy(
  () => import("./components/pages/talent/ApplicationHistory"),
);
const ApplicationManagement = lazy(
  () =>
    import("./components/pages/recruiter/application/ApplicationManagement"),
);
const CandidateManagement = lazy(
  () => import("./components/pages/recruiter/recruitment/CandidateManagement"),
);
const InterviewSchedule = lazy(
  () => import("./components/pages/recruiter/recruitment/InterviewSchedule"),
);
const CommunityPost = lazy(
  () => import("./components/pages/community/CommunityPost"),
);
const CommunityPostDetail = lazy(
  () => import("./components/pages/community/CommunityPostDetail"),
);
const PortfolioViewPage = lazy(
  () => import("./components/portfolio/view/PortfolioViewPage"),
);
const NotificationsPage = lazy(
  () => import("./components/pages/notification/NotificationsPage"),
);
const MyCommunityPost = lazy(
  () => import("./components/pages/community/MyCommunityPost"),
);
const MySavePost = lazy(
  () => import("./components/pages/community/save/TalentSavePost"),
);
const CompanySavePost = lazy(
  () => import("./components/pages/community/save/CompanySavePost"),
);
const TalentSavePost = lazy(
  () => import("./components/pages/community/save/TalentSavePost"),
);
const ErrorPage = lazy(() => import("./components/pages/ErrorPage"));
const LandingPage = lazy(() => import("./components/pages/LandingPage"));
const SetupTalentProfile = lazy(
  () => import("./components/pages/login/SetupTalentProfile"),
);
const SetupCompanyProfile = lazy(
  () => import("./components/pages/login/SetupCompanyProfile"),
);
const SupportCenterPage = lazy(
  () => import("./components/pages/SupportCenterPage"),
);
const PrivacyCenterPage = lazy(
  () => import("./components/pages/PrivacyCenterPage"),
);
const TermsPolicyPage = lazy(
  () => import("./components/pages/TermsPolicyPage"),
);
const OtherTalentProfilePage = lazy(
  () => import("./components/pages/profile/otherProfile/OtherTalentProfile"),
);
const OtherCompanyProfilePage = lazy(
  () => import("./components/pages/profile/otherProfile/OtherCompanyProfile"),
);
const PortfolioRanking = lazy(
  () => import("./components/pages/ranking/PortfolioRanking"),
);

function App() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const profile = useUserProfile(); // Custom hook để lấy thông tin profile người dùng từ Redux store

  useEffect(() => {
    if (!accessToken) {
      realtimeService.stop();
      return;
    }

    // 1. Khởi tạo và bắt đầu kết nối
    realtimeService.initConnection(accessToken);
    realtimeService.start();

    // 2. Định nghĩa hàm xử lý thông báo Realtime
    const handleGlobalNotification = (e: any) => {
      const event = e.detail;
      console.log("🔔 Received realtime notification event:", event);

      if (Number(event.actorId) !== profile?.user?.id) {
        let toastMsg = "";
        switch (event.type) {
          case "comment":
            toastMsg = ` ${event.actorName} đã bình luận bài viết của bạn`;
            break;
          case "like":
            toastMsg = ` ${event.actorName} đã thích bài viết của bạn`;
            break;
          case "reply":
            toastMsg = ` ${event.actorName} đã phản hồi bình luận của bạn`;
            break;
          default:
            toastMsg = ` ${event.content}`;
        }

        // Hiển thị Toast thông báo
        notify.info(toastMsg);

        // (Tùy chọn) Nếu bạn muốn cập nhật badge số lượng thông báo chưa đọc ở Header,
        // bạn có thể dispatch một action Redux ở đây.
      }
    };

    // 3. Đăng ký lắng nghe sự kiện từ window
    window.addEventListener(
      "realtime-notification" as any,
      handleGlobalNotification,
    );

    // 4. Cleanup function: Xóa listener và stop connection khi logout hoặc unmount
    return () => {
      window.removeEventListener(
        "realtime-notification" as any,
        handleGlobalNotification,
      );
      realtimeService.stop();
    };
  }, [accessToken, profile?.user?.id]); // Thêm profile.id để logic check "chính mình" chính xác

  return (
    <BrowserRouter>
      {/* Sử dụng Suspense bao bọc toàn bộ Routes. 
        Khi chuyển trang, LoadingWrapper sẽ hiển thị trong lúc tải file JS của trang đó.
      */}
      <Suspense fallback={<LoadingWrapper />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<WebLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="talent-home" element={<TalentHome />} />
            <Route path="recruiter-home" element={<RecruiterHome />} />
            <Route path="/job/:postId" element={<PostDetail />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ranking" element={<PortfolioRanking />} />
            <Route
              path="/profile/:userId"
              element={<OtherTalentProfilePage />}
            />
            <Route
              path="/recruiter-profile/:userId"
              element={<OtherCompanyProfilePage />}
            />
            <Route
              path="/application-history"
              element={<ApplicationHistory />}
            />
            <Route
              path="/application-management"
              element={<ApplicationManagement />}
            />
            <Route path="/recruiter-profile" element={<RecruiterProfile />} />
            <Route
              path="/candicate-management"
              element={<CandidateManagement />}
            />
            <Route path="/interview-schedule" element={<InterviewSchedule />} />
            <Route path="/company-saved" element={<CompanySavePost />} />
            <Route path="/talent-saved" element={<TalentSavePost />} />

            <Route
              path="/setup-talent-profile"
              element={<SetupTalentProfile />}
            />
            <Route
              path="/setup-company-profile"
              element={<SetupCompanyProfile />}
            />
            <Route
              path="/recruitment-management"
              element={<RecruitmentManagement />}
            />
            <Route
              path="/recruitment-management/create"
              element={<CreateRecruitmentPost />}
            />
            <Route
              path="/recruitment-management/:postId"
              element={<RecruitmentDetails />}
            />
            <Route
              path="/portfolioManagement"
              element={<PortfolioManagement />}
            />
            <Route path="/portfolio/create" element={<CreatePortfolio />} />
            <Route path="/portfolio/:id/edit" element={<EditPortfolio />} />
            <Route path="/emptyPortfolio" element={<EmptyPortfolioPage />} />
            <Route path="/community" element={<CommunityPost />} />
            <Route path="/community/:id" element={<CommunityPostDetail />} />
            <Route path="/portfolio/:id" element={<PortfolioViewPage />} />
            <Route path="/notification" element={<NotificationsPage />} />
            <Route path="/my-community-posts" element={<MyCommunityPost />} />
            <Route path="/my-save-posts" element={<MySavePost />} />
            <Route path="/support-center" element={<SupportCenterPage />} />
            <Route path="/privacy-center" element={<PrivacyCenterPage />} />
            <Route path="/terms-policy" element={<TermsPolicyPage />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          style={{ top: "85px" }}
          theme="light"
        />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
