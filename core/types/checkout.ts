export type CheckoutStepStatus = "completed" | "current" | "upcoming";

export interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  status: CheckoutStepStatus;
}
