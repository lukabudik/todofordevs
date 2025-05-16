import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Store for device codes (in a real implementation, use a database)
// In a production environment, this should be stored in a database
// For simplicity, we're using an in-memory store here
interface DeviceCodeEntry {
  deviceCode: string;
  userCode: string;
  expiresAt: Date;
  verified: boolean;
  userId?: string;
}

// In-memory store for demonstration purposes
// This will be reset when the server restarts
// In production, use your database
const deviceCodes: DeviceCodeEntry[] = [];

// Clean up expired device codes periodically
// This is a simple cleanup mechanism
// In production, you might want to use a cron job or a database TTL
setInterval(() => {
  const now = new Date();
  const expiredIndices = deviceCodes
    .map((entry, index) => (entry.expiresAt < now ? index : -1))
    .filter((index) => index !== -1)
    .sort((a, b) => b - a); // Sort in descending order to remove from end first

  for (const index of expiredIndices) {
    deviceCodes.splice(index, 1);
  }
}, 60000); // Run every minute

export async function POST() {
  try {
    // Check if the user is already authenticated
    const session = await getServerSession(authOptions);

    // Generate a device code (for the CLI to use when polling)
    const deviceCode = randomBytes(32).toString("hex");

    // Generate a user code (for the user to enter in the browser)
    // Make it short and easy to type, but still secure
    const userCode = randomBytes(3).toString("hex").toUpperCase();

    // Set expiration (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Store the codes
    deviceCodes.push({
      deviceCode,
      userCode,
      expiresAt,
      verified: false,
      // If the user is already authenticated, associate the device code with the user
      userId: session?.user?.id,
    });

    // Get the base URL from environment or use a default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Return the information needed by the CLI
    return NextResponse.json({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: `${baseUrl}/cli-auth`,
      expires_in: 900, // 15 minutes in seconds
      interval: 5, // Poll every 5 seconds
    });
  } catch (error) {
    console.error("Error initiating CLI login:", error);
    return NextResponse.json(
      { error: "Failed to initiate CLI login" },
      { status: 500 }
    );
  }
}

// Export the deviceCodes array for use in other routes
export { deviceCodes };
