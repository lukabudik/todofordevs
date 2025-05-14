import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  // Set content type to ensure we always return JSON
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400, headers }
      );
    }

    const { name, email, password, invitationToken } = requestBody;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400, headers }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409, headers }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create verification token
    const token = randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email
    if (user.email) {
      await sendVerificationEmail(
        { id: user.id, email: user.email, name: user.name },
        token
      );
    } else {
      throw new Error("User email is null");
    }

    // Handle specific invitation token if provided
    if (invitationToken) {
      // Find the specific invitation by token
      try {
        const invitation = await prisma.pendingInvitation.findUnique({
          where: {
            token: invitationToken,
            expiresAt: {
              gt: new Date(), // Only consider non-expired invitations
            },
          },
        });

        if (invitation) {
          // Verify that the email matches
          const emailMatches =
            invitation.email.toLowerCase() === email.toLowerCase();

          if (emailMatches) {
            // Create project collaboration
            await prisma.projectUser.create({
              data: {
                projectId: invitation.projectId,
                userId: user.id,
                role: "COLLABORATOR",
              },
            });

            // Delete the pending invitation
            await prisma.pendingInvitation.delete({
              where: {
                id: invitation.id,
              },
            });
          }
        }
      } catch (invitationError) {
        // Continue registration even if invitation processing fails
      }
    } else {
      // If no specific token was provided, check for any pending invitations for this email
      try {
        const pendingInvitations = await prisma.pendingInvitation.findMany({
          where: {
            email: email,
            expiresAt: {
              gt: new Date(), // Only consider non-expired invitations
            },
          },
        });

        // Convert pending invitations to actual collaborations
        if (pendingInvitations.length > 0) {
          // Create collaborations for each pending invitation
          await Promise.all(
            pendingInvitations.map(async (invitation) => {
              try {
                // Create project collaboration
                await prisma.projectUser.create({
                  data: {
                    projectId: invitation.projectId,
                    userId: user.id,
                    role: "COLLABORATOR",
                  },
                });

                // Delete the pending invitation
                await prisma.pendingInvitation.delete({
                  where: {
                    id: invitation.id,
                  },
                });
              } catch (singleInvitationError) {
                // Continue with other invitations even if one fails
              }
            })
          );
        }
      } catch (invitationsError) {
        // Continue registration even if invitation processing fails
      }
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email to verify your account.",
        user: userWithoutPassword,
      },
      { status: 201, headers }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during registration",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers }
    );
  }
}
