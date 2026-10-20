import { z } from "zod";
export const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(120),
  repoUrl: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      try {
        const hostname = new URL(value).hostname.toLowerCase();
        return hostname === "github.com" || hostname === "www.github.com";
      } catch {
        return false;
      }
    }, "Repository URL must be a valid GitHub URL"),
  liveUrl: z.string().trim().url(),
  description: z.string().trim().min(20).max(2000),
});
