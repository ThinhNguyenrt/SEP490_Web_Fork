import { useState } from "react";
import { Settings } from "lucide-react";
import SystemNotification from "./SystemNotification";
import CommunityNotification from "./CommunityNotification";
import { PremiumInNotification } from "@/components/common/Premium";

// --- Types ---
type TabType = "system" | "community";

// --- Sub-component: TabButton ---
const TabButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 text-sm font-semibold transition-all duration-200 border-b-2 cursor-pointer ${
      active
        ? "border-blue-500 text-blue-600 bg-blue-50 "
        : "border-transparent text-gray-500 hover:text-gray-700 "
    }`}
  >
    {label}
  </button>
);

// --- Main Page Component ---
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("system");

  return (
    <div className="min-h-screen bg-white  transition-colors duration-300">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">
                Thông báo của bạn
              </h1>
            </div>
            <p className="mt-1 text-gray-500 ">
              Cập nhật những hoạt động mới nhất của bạn trên SkillSnap.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-gray-100  text-gray-700  font-medium rounded-lg hover:bg-gray-200  transition-all cursor-pointer shadow-sm">
              Đánh dấu đọc tất cả
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Notifications List */}
          <div className="grow">
            <div className="flex border-b border-gray-200  mb-6">
              <TabButton
                label="Hệ thống"
                active={activeTab === "system"}
                onClick={() => setActiveTab("system")}
              />
              <TabButton
                label="Cộng đồng"
                active={activeTab === "community"}
                onClick={() => setActiveTab("community")}
              />
            </div>

            {/* Notification Content Area */}
            <div className="bg-blue-50/40  rounded-2xl p-6 min-h-125 border border-blue-50/50  animate-in fade-in duration-500">
              {activeTab === "system" ? (
                <SystemNotification />
              ) : (
                <CommunityNotification />
              )}
            </div>
          </div>

          {/* Right Column: Premium Sidebar */}
          <PremiumInNotification />
        </div>
      </main>
    </div>
  );
}
