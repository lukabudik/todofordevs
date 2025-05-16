import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Get all projects for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const authHeader = request.headers.get("Authorization");
    const isCliRequest = authHeader && authHeader.startsWith("Bearer ");

    if (!session?.user?.id && !isCliRequest) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let userId = session?.user?.id;

    if (isCliRequest && authHeader) {
      const bearerToken = authHeader.substring(7);
      try {
        // In a real application, you would use a more robust token verification library
        // and ensure the secret key is securely managed.
        // TODO: Implement robust JWT verification using jose and NEXTAUTH_SECRET for production.
        // This current implementation is for development and assumes a simple, unsigned token structure.
        const decodedToken = JSON.parse(
          Buffer.from(bearerToken.split(".")[1], "base64").toString()
        );
        if (decodedToken && decodedToken.id) {
          userId = decodedToken.id;
        } else {
          // console.error("Invalid CLI token format or missing user ID"); // Keep this commented out or remove for prod
          return NextResponse.json(
            { message: "Invalid CLI token" },
            { status: 401 }
          );
        }
      } catch (error) {
        // console.error("Error decoding CLI token:", error); // Keep this commented out or remove for prod
        return NextResponse.json(
          { message: "Error decoding CLI token" },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get projects owned by the user or where the user is a collaborator
    const projects = await prisma.project.findMany({
      where: {
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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json(
      { message: "An error occurred while fetching projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
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
      } catch (error) {
        return NextResponse.json(
          { message: "Error decoding CLI token" },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Project name is required" },
        { status: 400 }
      );
    }

    // const userId = session.user.id; // userId is now derived above

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        ownerId: userId, // Use the derived userId
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

    return NextResponse.json(
      { message: "Project created successfully", project },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while creating the project" },
      { status: 500 }
    );
  }
}
