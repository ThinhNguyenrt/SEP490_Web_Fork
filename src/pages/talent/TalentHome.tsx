import { useState } from "react";
import RecruitTab from "./talentHome/RecruitTab";
import ExploreTab from "./talentHome/ExploreTab";

export default function TalentHome() {
  const [activeTab, setActiveTab] = useState<"explore" | "recruit">("explore");

  return (
    <div className="min-h-screen">
      {/* Tab Menu UI */}

      <div className="max-w-2xl mx-auto flex justify-center bg-white">
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex-1 py-4 text-sm font-bold transition-all bg-white ${
            activeTab === "explore"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
              : "text-gray-500 border-b border-gray-200 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Khám phá
        </button>
        <button
          onClick={() => setActiveTab("recruit")}
          className={`flex-1 py-4 text-sm font-bold transition-all bg-white ${
            activeTab === "recruit"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30" // Active: viền xanh đậm 2px
              : "text-gray-500 border-b border-gray-200 hover:text-gray-700 hover:bg-gray-50" // Inactive: viền xám nhạt 1px
          }`}
        >
          Tuyển dụng
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="pt-4">
        {activeTab === "recruit" ? <RecruitTab /> : <ExploreTab />}
      </div>
    </div>
  );
}
