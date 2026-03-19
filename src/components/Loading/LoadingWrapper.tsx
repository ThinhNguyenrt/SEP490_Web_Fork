import { useEffect, useState } from "react";
import CustomLoading from "./Loading";

interface LoadingWrapperProps {
  children?: React.ReactNode; // Đặt children là tùy chọn
}
// Component LoadingWrapper nhận children để trì hoãn việc hiển thị
const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer nếu component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <CustomLoading />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;