// Store for device codes
export interface DeviceCodeEntry {
  deviceCode: string;
  userCode: string;
  expiresAt: Date;
  verified: boolean;
  userId?: string;
}

// In-memory store for demonstration purposes
// This will be reset when the server restarts
// In production, use your database
export const deviceCodes: DeviceCodeEntry[] = [];

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
