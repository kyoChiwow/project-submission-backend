import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { authenticate, allowRoles } from "../../middleware/auth.js";
import * as ProjectController from "./project.controller.js";
const router = Router();
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submission attempts. Try again in 15 minutes.",
  },
});
router.post(
  "/",
  authenticate,
  allowRoles("STUDENT"),
  submissionLimiter,
  ProjectController.createProject,
);
router.get(
  "/mine",
  authenticate,
  allowRoles("STUDENT"),
  ProjectController.getMyProject,
);
export default router;
