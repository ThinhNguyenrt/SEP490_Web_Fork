export interface PlanFeature {
  featureKey: string;
  featureName: string;
  value: string;
  type: "Number" | "Boolean" | "Text"; // Khớp với tài liệu
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: PlanFeature[];
}