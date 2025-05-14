import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Helper function to check if user has access to the task
async function hasTaskAccess(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          collaborators: true,
        },
      },
    },
  });

  if (!task) {
    return false;
  }

  // User has access if they are the project owner or a collaborator
  return (
    task.project.ownerId === userId ||
    task.project.collaborators.some(
      (collab: { userId: string }) => collab.userId === userId
    )
  );
}

// Helper function to check if assignee has access to the project
async function isValidAssignee(projectId: string, assigneeId: string) {
  const projectUser = await prisma.projectUser.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: assigneeId,
      },
    },
  });

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  // Assignee is valid if they are a collaborator or the project owner
  return !!projectUser || project?.ownerId === assigneeId;
}

// Define a type for task update data
interface TaskUpdateData {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: Date | null;
  assigneeId?: string | null;
}

// GET /api/tasks/[taskId] - Get a single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { taskId } = await params;

    // Check if user has access to the task
    const hasAccess = await hasTaskAccess(taskId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Get task with details
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { taskId } = await params;

    // Check if user has access to the task
    const hasAccess = await hasTaskAccess(taskId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Get the task to check its project
    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const { title, description, status, priority, dueDate, assigneeId } =
      await request.json();

    // Validate required fields
    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim() === "")
    ) {
      return NextResponse.json(
        { message: "Task title cannot be empty" },
        { status: 400 }
      );
    }

    if (
      status !== undefined &&
      (typeof status !== "string" || status.trim() === "")
    ) {
      return NextResponse.json(
        { message: "Task status cannot be empty" },
        { status: 400 }
      );
    }

    if (
      priority !== undefined &&
      (typeof priority !== "string" || priority.trim() === "")
    ) {
      return NextResponse.json(
        { message: "Task priority cannot be empty" },
        { status: 400 }
      );
    }

    // Validate assignee if provided
    if (assigneeId) {
      const isValid = await isValidAssignee(existingTask.projectId, assigneeId);
      if (!isValid) {
        return NextResponse.json(
          {
            message:
              "Assignee must be a collaborator or the owner of the project",
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: TaskUpdateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description || null;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;

    // Update task
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { taskId } = await params;

    // Check if user has access to the task
    const hasAccess = await hasTaskAccess(taskId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Delete the task
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the task" },
      { status: 500 }
    );
  }
}
