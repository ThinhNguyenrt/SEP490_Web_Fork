import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/store/hook";

export const useUserProfile = () => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<{
    displayName?: string;
    avatar?: string;
    coverImage?: string;
    activityField?: string;
    taxIdentification?: string;
    address?: string;
    description?: string;
    planName?: string; // Thêm trường planName
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!user && !!accessToken;

  const fetchProfileData = useCallback(async () => {
    if (!isLoggedIn) {
      setProfile(null);
      return;
    }

    let profileEndpoint = "";
    if (user?.role === 1 && user?.employeeId) {
      profileEndpoint = `api/Employee/${user.employeeId}`;
    } else if (user?.role === 2 && user?.companyId) {
      profileEndpoint = `api/Company/${user.companyId}`;
    }

    if (!profileEndpoint) return;

    setIsLoading(true);
    const baseUrl = "https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io";

    try {
      // Chạy song song cả 2 API để tối ưu thời gian
      const [profileRes, subRes] = await Promise.all([
        fetch(`${baseUrl}/${profileEndpoint}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        // Wrap subscription fetch để handle errors gracefully
        fetch(`https://subscription-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/Subscriptions/current`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch((err) => {
          console.warn("⚠️ Subscription service unavailable:", err.message);
          return new Response(JSON.stringify({}), { status: 200 }); // Return empty response on error
        })
      ]);

      let profileData = {} as any;
      let planName = "";

      // Xử lý dữ liệu Profile
      if (profileRes.ok) {
        profileData = await profileRes.json();
      }

      // Xử lý dữ liệu Subscription
      if (subRes.ok) {
        try {
          const subData = await subRes.json();
          planName = subData?.planName || "";
        } catch (e) {
          console.warn("⚠️ Failed to parse subscription data");
        }
      }

      // Map data dựa trên role và gán planName
      if (user?.role === 1) {
        setProfile({
          displayName: profileData.fullName || profileData.name || "N/A",
          avatar: profileData.avatar,
          coverImage: profileData.coverImage,
          planName: planName, 
        });
      } else {
        setProfile({
          displayName: profileData.companyName || profileData.name || profileData.fullName || "N/A",
          avatar: profileData.avatar,
          coverImage: profileData.coverImage,
          activityField: profileData.activityField,
          taxIdentification: profileData.taxIdentification,
          address: profileData.address,
          description: profileData.description,
          planName: planName,
        });
      }
    } catch (error) {
      console.error("Lỗi khi fetch profile & subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, accessToken, isLoggedIn]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return { profile, isLoggedIn, isLoading, user, refetch: fetchProfileData };
};