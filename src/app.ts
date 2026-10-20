import compression from "compression";
import cors from "cors";
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.get("/", (_req, res) => res.json({ success: true, message: "Project Submission API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/review", reviewRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const statusCode = typeof err === "object" && err !== null && "statusCode" in err
    && typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err instanceof Error && statusCode < 500 ? err.message : "Internal server error";
  res.status(statusCode).json({ success: false, message });
});
export default app;
