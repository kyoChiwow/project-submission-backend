export interface StudentProjectSummary {
  id: number;
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNote: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
}
