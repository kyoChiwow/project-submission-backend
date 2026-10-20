import { prisma } from "../../lib/prisma.js";
import type { CreateProjectInput } from "./project.interface.js";

export async function createProject(
  studentId: number,
  input: CreateProjectInput,
) {
  const existing = await prisma.project.findFirst({
    where: { OR: [{ studentId }, { repoUrl: input.repoUrl }] },
    select: { studentId: true, repoUrl: true },
  });
  if (existing) {
    const error = new Error(
      existing.studentId === studentId
        ? "You have already submitted a project. Only one submission per student is allowed."
        : "This GitHub repository has already been submitted.",
    ) as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }
  try {
    return await prisma.project.create({
      data: { ...input, studentId },
      select: {
        id: true,
        name: true,
        repoUrl: true,
        liveUrl: true,
        description: true,
        status: true,
        submittedAt: true,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const duplicate = new Error(
        "A submission already exists for this student or repository",
      ) as Error & { statusCode?: number };
      duplicate.statusCode = 409;
      throw duplicate;
    }
    throw error;
  }
}
export async function getMyProject(studentId: number) {
  return prisma.project.findUnique({
    where: { studentId },
    select: {
      id: true,
      name: true,
      repoUrl: true,
      liveUrl: true,
      description: true,
      status: true,
      reviewNote: true,
      submittedAt: true,
      reviewedAt: true,
    },
  });
}
