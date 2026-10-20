import { prisma } from "../../lib/prisma.js";

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
