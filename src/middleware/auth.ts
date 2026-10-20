import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma/client";

type JwtPayload = { sub: string; email: string; role: Role };

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });

  const secret = process.env.JWT_SECRET;
  if (!secret)
    return res
      .status(500)
      .json({ success: false, message: "JWT_SECRET is not configured" });

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    const id = Number(payload.sub);
    if (!Number.isInteger(id) || id <= 0)
      throw new Error("Invalid token subject");
    req.user = { id, email: payload.email, role: payload.role };
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

export function allowRoles(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You do not have permission to perform this action",
        });
    }
    next();
  };
}
