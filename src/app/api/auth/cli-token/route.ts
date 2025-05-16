import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

import { DeviceCodeEntry, deviceCodes } from "@/lib/deviceCodes";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get the device code from the query parameters
    const url = new URL(request.url);
    const deviceCode = url.searchParams.get("code");

    if (!deviceCode) {
      return NextResponse.json(
        { error: "device_code_required" },
        { status: 400 }
      );
    }

    // Find the device code entry
    const entry = deviceCodes.find(
      (e: DeviceCodeEntry) => e.deviceCode === deviceCode
    );

    if (!entry) {
      return NextResponse.json(
        { error: "invalid_device_code" },
        { status: 400 }
      );
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      // Remove the expired entry
      const index = deviceCodes.findIndex(
        (e: DeviceCodeEntry) => e.deviceCode === deviceCode
      );
      if (index !== -1) {
        deviceCodes.splice(index, 1);
      }

      return NextResponse.json(
        { error: "expired_device_code" },
        { status: 400 }
      );
    }

    // Check if verified
    if (!entry.verified || !entry.userId) {
      return NextResponse.json(
        { error: "authorization_pending" },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: entry.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 400 });
    }

    // Generate a token (using the same approach as NextAuth)
    // This is a simplified version - in production, use your actual token generation logic
    const token = sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
      process.env.NEXTAUTH_SECRET || "your-secret-key"
    );

    // Remove the device code entry (it's been used)
    const index = deviceCodes.findIndex(
      (e: DeviceCodeEntry) => e.deviceCode === deviceCode
    );
    if (index !== -1) {
      deviceCodes.splice(index, 1);
    }

    // Return the token and user info
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error getting CLI token:", error);
    return NextResponse.json(
      { error: "Failed to get CLI token" },
      { status: 500 }
    );
  }
}
