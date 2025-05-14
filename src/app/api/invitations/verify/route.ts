import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Set content type to ensure we always return JSON
  const headers = {
    "Content-Type": "application/json",
  };

  console.log(`[INVITATION-VERIFY] Processing request for URL: ${request.url}`);

  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log(
      `[INVITATION-VERIFY] Token from query params: ${token ? "Present (not showing for security)" : "Missing"}`
    );

    if (!token) {
      console.log(`[INVITATION-VERIFY] Error: Token is required`);
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400, headers }
      );
    }

    // Find the pending invitation by token
    console.log(
      `[INVITATION-VERIFY] Querying database for invitation with token`
    );
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
      console.log(
        `[INVITATION-VERIFY] Database query completed: ${invitation ? "Invitation found" : "No invitation found"}`
      );
    } catch (dbError) {
      console.error(`[INVITATION-VERIFY] Database error:`, dbError);
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
      console.log(`[INVITATION-VERIFY] Error: Invalid invitation token`);
      return NextResponse.json(
        { message: "Invalid invitation token" },
        { status: 404, headers }
      );
    }

    const now = new Date();
    const isExpired = invitation.expiresAt < now;
    console.log(
      `[INVITATION-VERIFY] Invitation expiration check: Current time=${now.toISOString()}, Expires=${invitation.expiresAt.toISOString()}, Expired=${isExpired}`
    );

    if (isExpired) {
      console.log(`[INVITATION-VERIFY] Error: Invitation has expired`);
      return NextResponse.json(
        { message: "Invitation has expired" },
        { status: 410, headers }
      );
    }

    // Return invitation details
    console.log(
      `[INVITATION-VERIFY] Preparing successful response with invitation details`
    );
    const responseData = {
      email: invitation.email,
      projectId: invitation.projectId,
      projectName: invitation.project.name,
      inviterId: invitation.inviterId,
      inviterName: invitation.inviter.name || invitation.inviter.email,
      expiresAt: invitation.expiresAt,
    };

    console.log(
      `[INVITATION-VERIFY] Sending successful response with status 200`
    );
    return NextResponse.json(responseData, { headers, status: 200 });
  } catch (error) {
    console.error("[INVITATION-VERIFY] Unhandled error:", error);

    // Ensure we return JSON even in case of errors
    console.log(`[INVITATION-VERIFY] Sending error response with status 500`);
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
