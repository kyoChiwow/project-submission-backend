import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import * as ProjectService from "./project.service.js";
import { createProjectSchema } from "./project.validation.js";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          success: false,
          message: "Please check the submitted fields",
          errors: parsed.error.flatten(),
        });
    const project = await ProjectService.createProject(
      req.user!.id,
      parsed.data,
    );
    return res
      .status(201)
      .json({
        success: true,
        message: "Project submitted successfully",
        data: { project },
      });
  },
);

export const getMyProject = asyncHandler(
  async (req: Request, res: Response) => {
    const project = await ProjectService.getMyProject(req.user!.id);
    return res.json({ success: true, data: { project } });
  },
);
