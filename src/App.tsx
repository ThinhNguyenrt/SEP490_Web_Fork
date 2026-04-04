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

// --- CHUYỂN SANG LAZY LOAD CHO CÁC PAGES ---
const LoginPage = lazy(() => import("./components/pages/login/Login"));
const ProfilePage = lazy(() => import("./components/pages/profile/Profile"));
const RecruiterProfile = lazy(() => import("./components/pages/recruiter/profile/RecruiterProfile"));
const PortfolioManagement = lazy(() => import("./components/pages/portfolio/PortfolioManagement"));
const EmptyPortfolioPage = lazy(() => import("./components/pages/portfolio/EmptyPortfolio"));
const CreatePortfolio = lazy(() => import("./components/pages/portfolio/CreatePortfolio"));
const EditPortfolio = lazy(() => import("./components/pages/portfolio/EditPortfolio"));
const TalentHome = lazy(() => import("./components/pages/talent/TalentHome"));
const RecruiterHome = lazy(() => import("./components/pages/recruiter/home/RecruiterHome"));
const RecruitmentManagement = lazy(() => import("./components/pages/recruiter/recruitment/RecruitmentManagement"));
const CreateRecruitmentPost = lazy(() => import("./components/pages/recruiter/recruitment/CreateRecruitmentPost"));
const RecruitmentDetails = lazy(() => import("./components/pages/recruiter/recruitment/RecruitmentDetails"));
const PostDetail = lazy(() => import("./components/pages/talent/PostDetail").then(module => ({ default: module.PostDetail })));
const ChatRoom = lazy(() => import("./components/pages/talent/ChatRoom"));
const ApplicationHistory = lazy(() => import("./components/pages/talent/ApplicationHistory"));
const ApplicationManagement = lazy(() => import("./components/pages/recruiter/application/ApplicationManagement"));
const CandidateManagement = lazy(() => import("./components/pages/recruiter/recruitment/CandidateManagement"));
const InterviewSchedule = lazy(() => import("./components/pages/recruiter/recruitment/InterviewSchedule"));
const CommunityPost = lazy(() => import("./components/pages/community/CommunityPost"));
const CommunityPostDetail = lazy(() => import("./components/pages/community/CommunityPostDetail"));
const PortfolioViewPage = lazy(() => import("./components/portfolio/view/PortfolioViewPage"));
const NotificationsPage = lazy(() => import("./components/pages/notification/NotificationsPage"));
const MyCommunityPost = lazy(() => import("./components/pages/community/MyCommunityPost"));
const MySavePost = lazy(() => import("./components/pages/community/save/TalentSavePost"));
const CompanySavePost = lazy(() => import("./components/pages/community/save/CompanySavePost"));
const TalentSavePost = lazy(() => import("./components/pages/community/save/TalentSavePost"));
const ErrorPage = lazy(() => import("./components/pages/ErrorPage"));
const LandingPage = lazy(() => import("./components/pages/LandingPage"));
const SetupTalentProfile = lazy(() => import("./components/pages/login/SetupTalentProfile"));
const SetupCompanyProfile = lazy(() => import("./components/pages/login/SetupCompanyProfile"));

function App() {
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      realtimeService.initConnection(accessToken);
      realtimeService.start();
    }
    return () => realtimeService.stop();
  }, [accessToken]);

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
            <Route path="/application-history" element={<ApplicationHistory />} />
            <Route path="/application-management" element={<ApplicationManagement />} />
            <Route path="/recruiter-profile" element={<RecruiterProfile />} />
            <Route path="/candicate-management" element={<CandidateManagement />} />
            <Route path="/interview-schedule" element={<InterviewSchedule />} />
            <Route path="/company-saved" element={<CompanySavePost />} />
            <Route path="/talent-saved" element={<TalentSavePost />} />
            <Route path="/setup-talent-profile" element={<SetupTalentProfile />} />
            <Route path="/setup-company-profile" element={<SetupCompanyProfile />} />
            <Route path="/recruitment-management" element={<RecruitmentManagement />} />
            <Route path="/recruitment-management/create" element={<CreateRecruitmentPost />} />
            <Route path="/recruitment-management/:postId" element={<RecruitmentDetails />} />
            <Route path="/portfolioManagement" element={<PortfolioManagement />} />
            <Route path="/portfolio/create" element={<CreatePortfolio />} />
            <Route path="/portfolio/:id/edit" element={<EditPortfolio />} />
            <Route path="/emptyPortfolio" element={<EmptyPortfolioPage />} />
            <Route path="/community" element={<CommunityPost />} />
            <Route path="/community/:id" element={<CommunityPostDetail />} />
            <Route path="/portfolio/:id" element={<PortfolioViewPage />} />
            <Route path="/notification" element={<NotificationsPage />} />
            <Route path="/my-community-posts" element={<MyCommunityPost />} />
            <Route path="/my-save-posts" element={<MySavePost />} />
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