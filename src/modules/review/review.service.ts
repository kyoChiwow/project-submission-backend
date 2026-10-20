import { prisma } from "../../lib/prisma.js";
import type {
  ReviewDecisionInput,
  ReviewListQuery,
} from "./review.interface.js";

export async function getStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PENDING" } }),
    prisma.project.count({ where: { status: "APPROVED" } }),
    prisma.project.count({ where: { status: "REJECTED" } }),
  ]);
  return { total, pending, approved, rejected };
}

export async function listProjects(query: ReviewListQuery) {
  const { page, limit, status, search } = query;
  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              student: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              student: {
                email: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { submittedAt: "desc" },
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
        student: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);
  return {
    projects,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function reviewProject(
  projectId: number,
  mentorId: number,
  input: ReviewDecisionInput,
) {
  const current = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, studentId: true },
  });
  if (!current) {
    const error = new Error("Project not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }
  if (current.studentId === mentorId) {
    const error = new Error(
      "Mentors cannot review their own submissions",
    ) as Error & { statusCode?: number };
    error.statusCode = 403;
    throw error;
  }
  return prisma.project.update({
    where: { id: projectId },
    data: {
      status: input.status,
      reviewNote: input.reviewNote || null,
      reviewedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      status: true,
      reviewNote: true,
      reviewedAt: true,
    },
  });
}
