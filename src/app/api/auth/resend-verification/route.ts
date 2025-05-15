import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user with the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return NextResponse.json(
        {
          message:
            "If your email exists in our system, we've sent a verification link",
        },
        { status: 200 }
      );
    }

    // Check if the email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Your email is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create a new verification token
    const token = randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send the verification email
    if (user.email) {
      await sendVerificationEmail(
        { id: user.id, email: user.email, name: user.name },
        token
      );
    } else {
      throw new Error("User email is null");
    }

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { message: "An error occurred while resending the verification email" },
      { status: 500 }
    );
  }
}
