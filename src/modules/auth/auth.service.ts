import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import type { SignupInput, LoginInput } from "./auth.interface.js";

function issueToken(user: {
  id: number;
  email: string;
  role: "STUDENT" | "MENTOR";
}) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32)
    throw new Error(
      "JWT_SECRET must be configured with at least 32 characters",
    );
  return jwt.sign({ email: user.email, role: user.role }, secret, {
    subject: String(user.id),
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "1d") as jwt.SignOptions["expiresIn"],
  });
}


export async function signup(input: SignupInput) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    const error = new Error(
      "An account with this email already exists",
    ) as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: input.name, email, passwordHash, role: "STUDENT" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return { user, token: issueToken(user) };
}


export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    const error = new Error("Invalid email or password") as Error & {
      statusCode?: number;
    };
    error.statusCode = 401;
    throw error;
  }
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
  return { user: safeUser, token: issueToken(user) };
}


export async function getCurrentUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}
