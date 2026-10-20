import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import * as AuthService from "./auth.service.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
  const data = await AuthService.signup(parsed.data);
  return res
    .status(201)
    .json({ success: true, message: "Account created", data });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  const data = await AuthService.login(parsed.data);
  return res.json({ success: true, data });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.getCurrentUser(req.user!.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, data: { user } });
});
