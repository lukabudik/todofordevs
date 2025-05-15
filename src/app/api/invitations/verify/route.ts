import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Set content type to ensure we always return JSON
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400, headers }
      );
    }

    // Find the pending invitation by token
    let invitation;
    try {
      invitation = await prisma.pendingInvitation.findUnique({
        where: {
          token,
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
          inviter: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (dbError) {
      return NextResponse.json(
        {
          message: "Database error while verifying invitation",
          error: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500, headers }
      );
    }

    // Check if invitation exists and is not expired
    if (!invitation) {
      return NextResponse.json(
        { message: "Invalid invitation token" },
        { status: 404, headers }
      );
    }

    const now = new Date();
    const isExpired = invitation.expiresAt < now;

    if (isExpired) {
      return NextResponse.json(
        { message: "Invitation has expired" },
        { status: 410, headers }
      );
    }

    // Return invitation details
    const responseData = {
      email: invitation.email,
      projectId: invitation.projectId,
      projectName: invitation.project.name,
      inviterId: invitation.inviterId,
      inviterName: invitation.inviter.name || invitation.inviter.email,
      expiresAt: invitation.expiresAt,
    };

    return NextResponse.json(responseData, { headers, status: 200 });
  } catch (error) {
    // Ensure we return JSON even in case of errors
    return NextResponse.json(
      {
        message: "An error occurred while verifying the invitation",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
