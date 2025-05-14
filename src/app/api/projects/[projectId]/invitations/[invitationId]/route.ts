import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE /api/projects/[projectId]/invitations/[invitationId] - Cancel a pending invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; invitationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { projectId, invitationId } = await params;

    // Check if user is the project owner
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Find the pending invitation
    const invitation = await prisma.pendingInvitation.findUnique({
      where: {
        id: invitationId,
        projectId,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 }
      );
    }

    // Delete the invitation
    await prisma.pendingInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    return NextResponse.json({
      message: "Invitation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json(
      { message: "An error occurred while cancelling the invitation" },
      { status: 500 }
    );
  }
}
