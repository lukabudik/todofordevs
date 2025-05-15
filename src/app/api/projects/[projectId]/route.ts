import { NextResponse } from "next/server";
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

// Helper function to check if user is the project owner
async function isProjectOwner(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  return !!project;
}

// GET /api/projects/[projectId] - Get a single project by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const actualParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const projectId = actualParams.projectId;

    // Check if user has access to the project
    const hasAccess = await hasProjectAccess(projectId, userId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Get project with tasks
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while fetching the project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[projectId] - Update a project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const actualParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const projectId = actualParams.projectId;

    // Check if user is the project owner
    const isOwner = await isProjectOwner(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Only the project owner can update the project" },
        { status: 403 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: name.trim(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while updating the project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const actualParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const projectId = actualParams.projectId;

    // Check if user is the project owner
    const isOwner = await isProjectOwner(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Only the project owner can delete the project" },
        { status: 403 }
      );
    }

    // Delete the project (cascading delete will handle tasks and collaborators)
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while deleting the project" },
      { status: 500 }
    );
  }
}
