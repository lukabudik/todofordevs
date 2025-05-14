import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    // Find the password reset token
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if token exists and is not expired
    if (!passwordResetToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    if (passwordResetToken.expires < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: passwordResetToken.id },
      });

      return NextResponse.json(
        { message: "Token has expired" },
        { status: 400 }
      );
    }

    // Token is valid
    return NextResponse.json(
      {
        message: "Token is valid",
        userId: passwordResetToken.userId,
        email: passwordResetToken.user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying the token" },
      { status: 500 }
    );
  }
}
