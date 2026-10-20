import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.me);


export default router;
