import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { deviceCodes } from "../cli-login-initiate/route";

export async function POST(request: Request) {
  try {
    // Get the user code from the request body
    const { userCode } = await request.json();

    if (!userCode) {
      return NextResponse.json(
        { error: "user_code_required" },
        { status: 400 }
      );
    }

    // Find the device code entry by user code
    const entry = deviceCodes.find((e) => e.userCode === userCode);

    if (!entry) {
      return NextResponse.json({ error: "invalid_user_code" }, { status: 400 });
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      // Remove the expired entry
      const index = deviceCodes.findIndex((e) => e.userCode === userCode);
      if (index !== -1) {
        deviceCodes.splice(index, 1);
      }

      return NextResponse.json({ error: "expired_user_code" }, { status: 400 });
    }

    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    // Mark the device code as verified and associate it with the user
    entry.verified = true;
    entry.userId = session.user.id;

    return NextResponse.json({
      success: true,
      message:
        "Device authenticated successfully. You can now return to the CLI.",
    });
  } catch (error) {
    console.error("Error verifying CLI code:", error);
    return NextResponse.json(
      { error: "Failed to verify CLI code" },
      { status: 500 }
    );
  }
}
