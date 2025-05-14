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

// DELETE /api/projects/[projectId]/collaborators/[userId] - Remove a collaborator from a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { projectId, userId } = await params;

    // Check if current user is the project owner
    const isOwner = await isProjectOwner(projectId, currentUserId);
    if (!isOwner) {
      return NextResponse.json(
        { message: "Only the project owner can remove collaborators" },
        { status: 403 }
      );
    }

    // Check if the user to remove exists
    const userToRemove = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userToRemove) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the user is trying to remove themselves (which is not allowed)
    if (userId === currentUserId) {
      return NextResponse.json(
        { message: "You cannot remove yourself as the owner" },
        { status: 400 }
      );
    }

    // Check if the user is actually a collaborator
    const collaborator = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { message: "User is not a collaborator of this project" },
        { status: 404 }
      );
    }

    // Remove the collaborator
    await prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return NextResponse.json({
      message: "Collaborator removed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while removing the collaborator" },
      { status: 500 }
    );
  }
}
