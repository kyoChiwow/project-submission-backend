import { Router } from "express";
import { authenticate, allowRoles } from "../../middleware/auth.js";
import * as ReviewController from "./review.controller.js";


const router = Router();

router.use(authenticate, allowRoles("MENTOR"));
router.get("/stats", ReviewController.stats);
router.get("/projects", ReviewController.listProjects);
router.patch("/projects/:id/review", ReviewController.reviewProject);

export default router;
