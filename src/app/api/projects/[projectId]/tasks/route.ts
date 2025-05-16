import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to check if user has access to the project
async function hasProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: {
              userId,
            },
          },
        },
      ],
    },
  });

  return !!project;
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

// Define a type for task filters
interface TaskFilter {
  projectId: string;
  status?: string;
  priority?: string;
  assigneeId?: string | null;
}

// GET /api/projects/[projectId]/tasks - Get all tasks for a project
export async function GET(
  request: NextRequest, // Changed from Request to NextRequest
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const actualParams = await params;
    const session = await getServerSession(authOptions);
    const authHeader = request.headers.get("Authorization");
    const isCliRequest = authHeader && authHeader.startsWith("Bearer ");

    let userId = session?.user?.id;

    if (isCliRequest && authHeader) {
      const bearerToken = authHeader.substring(7);
      try {
        // TODO: Implement robust JWT verification using jose and NEXTAUTH_SECRET for production.
        const decodedToken = JSON.parse(
          Buffer.from(bearerToken.split(".")[1], "base64").toString()
        );
        if (decodedToken && decodedToken.id) {
          userId = decodedToken.id;
        } else {
          return NextResponse.json(
            { message: "Invalid CLI token" },
            { status: 401 }
          );
        }
      } catch (_error) {
        return NextResponse.json(
          { message: "Error decoding CLI token" },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projectId = actualParams.projectId;

    // Check if user has access to the project
    const hasAccess = await hasProjectAccess(projectId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Parse query parameters for sorting and filtering
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const assigneeId = url.searchParams.get("assigneeId");
    const sortBy = url.searchParams.get("sortBy") || "updatedAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    // Build filter conditions
    const where: TaskFilter = {
      projectId,
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assigneeId) {
      where.assigneeId = assigneeId === "unassigned" ? null : assigneeId;
    }

    // Get tasks with filtering and sorting
    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while fetching tasks" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/tasks - Create a new task
export async function POST(
  request: NextRequest, // Changed from Request to NextRequest
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const actualParams = await params;
    const session = await getServerSession(authOptions);
    const authHeader = request.headers.get("Authorization");
    const isCliRequest = authHeader && authHeader.startsWith("Bearer ");

    let userId = session?.user?.id;

    if (isCliRequest && authHeader) {
      const bearerToken = authHeader.substring(7);
      try {
        // TODO: Implement robust JWT verification using jose and NEXTAUTH_SECRET for production.
        const decodedToken = JSON.parse(
          Buffer.from(bearerToken.split(".")[1], "base64").toString()
        );
        if (decodedToken && decodedToken.id) {
          userId = decodedToken.id;
        } else {
          return NextResponse.json(
            { message: "Invalid CLI token" },
            { status: 401 }
          );
        }
      } catch (_error) {
        return NextResponse.json(
          { message: "Error decoding CLI token" },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projectId = actualParams.projectId;

    // Check if user has access to the project
    const hasAccess = await hasProjectAccess(projectId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const { title, description, status, priority, dueDate, assigneeId } =
      await request.json();

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { message: "Task title is required" },
        { status: 400 }
      );
    }

    if (!status || typeof status !== "string" || status.trim() === "") {
      return NextResponse.json(
        { message: "Task status is required" },
        { status: 400 }
      );
    }

    if (!priority || typeof priority !== "string" || priority.trim() === "") {
      return NextResponse.json(
        { message: "Task priority is required" },
        { status: 400 }
      );
    }

    // Validate assignee if provided
    if (assigneeId) {
      const isValid = await isValidAssignee(projectId, assigneeId);
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

    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
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
      },
    });

    return NextResponse.json(
      { message: "Task created successfully", task },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while creating the task" },
      { status: 500 }
    );
  }
}
