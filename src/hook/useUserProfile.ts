import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hook"; // Điều chỉnh đường dẫn theo dự án của bạn

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
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!user;

  const fetchProfileData = async () => {
    // Xác định Endpoint dựa trên role (1: Talent, 2: Company/Recruiter)
    let endpoint = "";
    if (user?.role === 1 && user?.employeeId) {
      endpoint = `api/Employee/${user.employeeId}`;
    } else if (user?.role === 2 && user?.companyId) {
      endpoint = `api/Company/${user.companyId}`;
    }

    if (!endpoint || !accessToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (user?.role === 1) {
          setProfile({
            displayName: data.fullName || data.name || "N/A",
            avatar: data.avatar,
            coverImage: data.coverImage,
          });
        } else if (user?.role === 2) {
          setProfile({
            displayName:
              data.companyName || data.name || data.fullName || "N/A",
            avatar: data.avatar,
            coverImage: data.coverImage,
            activityField: data.activityField,
            taxIdentification: data.taxIdentification,
            address: data.address,
            description: data.description,
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi fetch profile header:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileData();
    } else {
      setProfile(null);
    }
  }, [isLoggedIn, user?.employeeId, user?.companyId, accessToken]);

  // Trả về các giá trị cần thiết để UI sử dụng
  return { profile, isLoggedIn, isLoading, user };
};
