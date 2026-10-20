export interface ReviewDecisionInput {
  status: "APPROVED" | "REJECTED";
  reviewNote?: string;
}
export interface ReviewListQuery {
  page: number;
  limit: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
}
