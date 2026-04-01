import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./components/pages/login/Login";
import { WebLayout } from "./components/common/WebLayout";
import ProfilePage from "./components/pages/profile/Profile";
import RecruiterProfile from "./components/pages/recruiter/profile/RecruiterProfile";
import PortfolioManagement from "./components/pages/portfolio/PortfolioManagement";
import EmptyPortfolioPage from "./components/pages/portfolio/EmptyPortfolio";
import CreatePortfolio from "./components/pages/portfolio/CreatePortfolio";
import EditPortfolio from "./components/pages/portfolio/EditPortfolio";
import TalentHome from "./components/pages/talent/TalentHome";
import RecruiterHome from "./components/pages/recruiter/home/RecruiterHome";
import RecruitmentManagement from "./components/pages/recruiter/recruitment/RecruitmentManagement";
import CreateRecruitmentPost from "./components/pages/recruiter/recruitment/CreateRecruitmentPost";
import RecruitmentDetails from "./components/pages/recruiter/recruitment/RecruitmentDetails";
import { PostDetail } from "./components/pages/talent/PostDetail";
import ChatRoom from "./components/pages/talent/ChatRoom";
import ApplicationHistory from "./components/pages/talent/ApplicationHistory";
import ApplicationManagement from "./components/pages/recruiter/application/ApplicationManagement";
import CandidateManagement from "./components/pages/recruiter/recruitment/CandidateManagement";
import InterviewSchedule from "./components/pages/recruiter/recruitment/InterviewSchedule";

import CommunityPost from "./components/pages/community/CommunityPost";
import CommunityPostDetail from "./components/pages/community/CommunityPostDetail";

import PortfolioViewPage from "./components/portfolio/view/PortfolioViewPage";
import NotificationsPage from "./components/pages/notification/NotificationsPage";
import MyCommunityPost from "./components/pages/community/MyCommunityPost";
import MySavePost from "./components/pages/community/save/TalentSavePost";
import CompanySavePost from "./components/pages/community/save/CompanySavePost";
import TalentSavePost from "./components/pages/community/save/TalentSavePost";
import ErrorPage from "./components/pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import LandingPage from "./components/pages/LandingPage";
import LoadingWrapper from "./components/Loading/LoadingWrapper";
import SetupTalentProfile from "./components/pages/login/SetupTalentProfile";
import SetupCompanyProfile from "./components/pages/login/SetupCompanyProfile";
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingWrapper />}>
        <LoadingWrapper>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<WebLayout />}>
              <Route path="talent-home" element={<TalentHome />} />
              <Route path="recruiter-home" element={<RecruiterHome />} />
              <Route path="/job/:postId" element={<PostDetail />} />
              <Route path="/chat" element={<ChatRoom />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<LandingPage />} />
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
              <Route
                path="/interview-schedule"
                element={<InterviewSchedule />}
              />
              <Route path="/company-saved" element={<CompanySavePost />} />
              <Route path="/talent-saved" element={<TalentSavePost />} />
              <Route path="/setup-talent-profile" element={<SetupTalentProfile />} />
              <Route path="/setup-company-profile" element={<SetupCompanyProfile />} />
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
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            // Thêm style trực tiếp vào đây
            // Header của bạn thường cao khoảng 56px - 64px,
            // set top khoảng 80px - 100px là đẹp.
            style={{ top: "85px" }}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </LoadingWrapper>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
