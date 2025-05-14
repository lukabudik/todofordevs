import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

// GET /api/projects/[projectId]/collaborators - Get all collaborators for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { projectId } = await params;

    // Check if user has access to the project (owner or collaborator)
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
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

    // Check if user is owner or collaborator
    const isOwner = project.ownerId === userId;
    const isCollaborator = project.collaborators.some(
      (collab: { userId: string }) => collab.userId === userId
    );

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Get owner details
    const owner = await prisma.user.findUnique({
      where: {
        id: project.ownerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // Format collaborators
    const collaborators = project.collaborators.map(
      (collab: {
        userId: string;
        role: string;
        user: {
          name: string | null;
          email: string | null;
          image: string | null;
        };
      }) => ({
        id: collab.userId,
        name: collab.user.name,
        email: collab.user.email,
        image: collab.user.image,
        role: collab.role,
      })
    );

    // Add owner to the list with role OWNER
    const members = [
      {
        id: owner?.id,
        name: owner?.name,
        email: owner?.email,
        image: owner?.image,
        role: "OWNER",
      },
      ...collaborators,
    ];

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching collaborators" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/collaborators - Add a collaborator to a project
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { projectId } = await params;

    // Check if user is the project owner
    const isOwner = await isProjectOwner(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Only the project owner can add collaborators" },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const userToInvite = await prisma.user.findUnique({
      where: {
        email: email.trim(),
      },
    });

    if (!userToInvite) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is already the owner
    if (userToInvite.id === userId) {
      return NextResponse.json(
        { message: "You cannot add yourself as a collaborator" },
        { status: 400 }
      );
    }

    // Check if user is already a collaborator
    const existingCollaborator = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToInvite.id,
        },
      },
    });

    if (existingCollaborator) {
      return NextResponse.json(
        { message: "User is already a collaborator" },
        { status: 400 }
      );
    }

    // Add user as collaborator
    const collaborator = await prisma.projectUser.create({
      data: {
        projectId,
        userId: userToInvite.id,
        role: "COLLABORATOR",
      },
      include: {
        user: {
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
      {
        message: "Collaborator added successfully",
        collaborator: {
          id: collaborator.userId,
          name: collaborator.user.name,
          email: collaborator.user.email,
          image: collaborator.user.image,
          role: collaborator.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the collaborator" },
      { status: 500 }
    );
  }
}
