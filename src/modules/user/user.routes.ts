import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import * as UserController from "./user.controller.js";

const router = Router();

router.get("/me/project", authenticate, UserController.getMyProject);

export default router;
