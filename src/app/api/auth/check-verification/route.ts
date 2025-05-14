import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || !token.sub) {
      return NextResponse.json(
        { verified: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { verified: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verified: !!user.emailVerified,
      message: user.emailVerified
        ? "Email is verified"
        : "Email is not verified",
    });
  } catch (error) {
    console.error("Error checking email verification:", error);
    return NextResponse.json(
      {
        verified: false,
        message: "Error checking email verification",
      },
      { status: 500 }
    );
  }
}
