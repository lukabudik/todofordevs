import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all tasks assigned to the current user, including project information
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: session.user.id,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Group tasks by project
    const tasksByProject = tasks.reduce((acc, task) => {
      const projectId = task.projectId;
      if (!acc[projectId]) {
        acc[projectId] = {
          project: task.project,
          tasks: [],
        };
      }
      acc[projectId].tasks.push(task);
      return acc;
    }, {} as Record<string, { project: { id: string; name: string; ownerId: string }; tasks: any[] }>);

    return NextResponse.json({
      tasksByProject: Object.values(tasksByProject),
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
