import type { Role } from "../../../generated/prisma/client";
export interface SignupInput {
  name: string;
  email: string;
  password: string;
}
export interface LoginInput {
  email: string;
  password: string;
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}
export interface AuthResponse {
  user: AuthUser;
  token: string;
}
