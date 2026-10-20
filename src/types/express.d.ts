import type { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string; role: Role };
    }
  }
}
export {};
