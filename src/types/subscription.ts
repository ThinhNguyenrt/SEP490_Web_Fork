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
export interface SubscriptionHistoryItem {
  id: string;
  userId: number;
  planId: number;
  subscriptionId: number;
  planName: string | null;
  amount: number;
  currency: string;
  provider: string;
  status: "Pending" | "Succeeded" | "Failed" | "Cancelled" | "Expired";
  transactionId: string | null;
  orderCode: string;
  createdAt: string;
  paidAt: string | null;
}

// Đối với API có phân trang (pagination)
export interface PaymentHistoryResponse {
  items: SubscriptionHistoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}
export interface CurrentSubscription {
  id: number;
  planName: string;
  endDate: string;
  status: string;
  autoRenew: boolean;
}

export interface Entitlements {
  planName: string;
  features: {
    MAX_APPLY: string;
    MAX_PORTFOLIOS: string;
    AI_MATCHING: boolean;
    BOOST_PROFILE: boolean;
    COMPLIMENT_ACCESS: boolean;
  };
  expiredAt: string;
}