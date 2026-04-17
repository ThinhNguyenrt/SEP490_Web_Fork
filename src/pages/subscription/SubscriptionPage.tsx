import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { notify } from "@/lib/toast";
import PlanCard from "./PlanCard";

const SubscriptionPage = () => {
  // Type safe cho state plans
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          `https://subscription-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/Plans`,
        );
        if (res.ok) {
          const data: SubscriptionPlan[] = await res.json();
          setPlans(data);
        }
      } catch (error) {
        notify.error("Không thể tải danh sách gói cước");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Đang tải ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-11 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};
export default SubscriptionPage;
