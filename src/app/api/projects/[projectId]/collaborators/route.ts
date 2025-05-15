import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendProjectInvitationEmail,
  sendPendingInvitationEmail,
} from "@/lib/email";
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

    // Get pending invitations if user is the owner
    let pendingInvitations: Array<{
      id: string;
      email: string;
      createdAt: Date;
      expiresAt: Date;
      inviterId: string;
      inviterName: string;
    }> = [];
    if (isOwner) {
      const dbInvitations = await prisma.pendingInvitation.findMany({
        where: {
          projectId,
          expiresAt: {
            gt: new Date(), // Only include non-expired invitations
          },
        },
        include: {
          inviter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Format pending invitations
      pendingInvitations = dbInvitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
        inviterId: invitation.inviterId,
        inviterName: invitation.inviter.name || invitation.inviter.email || "",
      }));
    }

    return NextResponse.json({ members, pendingInvitations });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while fetching collaborators" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/collaborators - Add a collaborator to a project
export async function POST(
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

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

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

    // Create properly typed objects for the email functions
    const inviterForEmail = {
      id: inviter.id,
      name: inviter.name,
      email: inviter.email,
    };

    // If user doesn't exist, create a pending invitation
    if (!userToInvite || !userToInvite.email) {
      // Check if there's already a pending invitation for this email and project
      const existingInvitation = await prisma.pendingInvitation.findUnique({
        where: {
          email_projectId: {
            email: email.trim(),
            projectId,
          },
        },
      });

      if (existingInvitation) {
        // If invitation exists but is expired, update it
        if (existingInvitation.expiresAt < new Date()) {
          const token = generateInvitationToken();
          const expiresAt = calculateExpirationDate();

          await prisma.pendingInvitation.update({
            where: { id: existingInvitation.id },
            data: {
              token,
              expiresAt,
            },
          });

          // Send invitation email
          try {
            await sendPendingInvitationEmail(
              inviterForEmail,
              email.trim(),
              project,
              token
            );
          } catch {
            // Silently handle email errors - invitation is still updated
          }

          return NextResponse.json(
            {
              message: "Invitation renewed and sent successfully",
              isPendingInvitation: true,
            },
            { status: 200 }
          );
        }

        // If invitation exists and is not expired, just return success
        return NextResponse.json(
          {
            message: "Invitation already sent to this email",
            isPendingInvitation: true,
          },
          { status: 200 }
        );
      }

      // Create new pending invitation
      const token = generateInvitationToken();
      const expiresAt = calculateExpirationDate();

      const pendingInvitation = await prisma.pendingInvitation.create({
        data: {
          email: email.trim(),
          token,
          expiresAt,
          projectId,
          inviterId: userId,
        },
      });

      // Send invitation email
      try {
        await sendPendingInvitationEmail(
          inviterForEmail,
          email.trim(),
          project,
          token
        );
      } catch {
        // Silently handle email errors - invitation is still created
      }

      return NextResponse.json(
        {
          message: "Invitation sent successfully",
          isPendingInvitation: true,
          pendingInvitation: {
            id: pendingInvitation.id,
            email: pendingInvitation.email,
            expiresAt: pendingInvitation.expiresAt,
          },
        },
        { status: 201 }
      );
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

    // Send invitation email
    try {
      // Make sure userToInvite.email is not null (we've already checked this above)
      const inviteeEmail = userToInvite.email as string;

      const inviteeForEmail = {
        id: userToInvite.id,
        name: userToInvite.name,
        email: inviteeEmail,
      };

      await sendProjectInvitationEmail(
        inviterForEmail,
        inviteeForEmail,
        project
      );
    } catch {
      // Silently handle email errors - the user is still added as a collaborator
    }

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
  } catch {
    return NextResponse.json(
      { message: "An error occurred while adding the collaborator" },
      { status: 500 }
    );
  }
}
