import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendPendingInvitationEmail } from "@/lib/email";
import crypto from "crypto";

// Helper function to generate a secure token for invitations
function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Helper function to calculate expiration date (default: 7 days from now)
function calculateExpirationDate(days: number = 7): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// POST /api/projects/[projectId]/invitations/[invitationId]/resend - Resend a pending invitation
export async function POST(
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
      select: {
        id: true,
        name: true,
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

    // Generate a new token and update the expiration date
    const token = generateInvitationToken();
    const expiresAt = calculateExpirationDate();

    // Update the invitation
    const updatedInvitation = await prisma.pendingInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        token,
        expiresAt,
      },
    });

    // Get inviter details
    const inviter = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!inviter || !inviter.email) {
      return NextResponse.json(
        { message: "Inviter not found or has no email" },
        { status: 500 }
      );
    }

    // Create properly typed objects for the email function
    const inviterForEmail = {
      id: inviter.id,
      name: inviter.name,
      email: inviter.email,
    };

    // Send invitation email
    try {
      await sendPendingInvitationEmail(
        inviterForEmail,
        invitation.email,
        project,
        token
      );
    } catch (emailError) {
      // Silently handle email errors - the invitation is still updated
    }

    return NextResponse.json({
      message: "Invitation resent successfully",
      invitation: {
        id: updatedInvitation.id,
        email: updatedInvitation.email,
        expiresAt: updatedInvitation.expiresAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while resending the invitation" },
      { status: 500 }
    );
  }
}
