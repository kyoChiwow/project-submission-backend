import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import * as ReviewService from "./review.service.js";
import {
  reviewDecisionSchema,
  reviewQuerySchema,
} from "./review.validation.js";

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const data = await ReviewService.getStats();
  return res.json({ success: true, data });
});
export const listProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = reviewQuerySchema.safeParse(req.query);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid query parameters",
          errors: parsed.error.flatten(),
        });
    const data = await ReviewService.listProjects(parsed.data);
    return res.json({ success: true, data });
  },
);
export const reviewProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    const parsed = reviewDecisionSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid review data",
          errors: parsed.error.flatten(),
        });
    const project = await ReviewService.reviewProject(
      id,
      req.user!.id,
      parsed.data,
    );
    return res.json({
      success: true,
      message: `Project ${parsed.data.status.toLowerCase()}`,
      data: { project },
    });
  },
);
