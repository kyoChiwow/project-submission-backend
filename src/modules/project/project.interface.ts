export interface CreateProjectInput {
  name: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
}
export interface ProjectQueryInput {
  page: number;
  limit: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  search?: string;
}
