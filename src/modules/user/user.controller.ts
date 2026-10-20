import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import * as UserService from "./user.service.js";

export const getMyProject = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await UserService.getMyProject(req.user!.id);
    return res.json({ success: true, data: { project } });
  },
);
