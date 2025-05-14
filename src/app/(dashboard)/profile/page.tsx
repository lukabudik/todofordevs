"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Update the session with the new name
      await update({
        ...session,
        user: {
          ...session.user,
          name,
        },
      });

      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while updating your profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initials for avatar if no image is available
  const getInitials = () => {
    if (!session.user.name) return "?";
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-primary-foreground">
                  {getInitials()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {session.user.name || "Anonymous User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {success}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your name"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(session.user.name || "");
                    setError("");
                    setSuccess("");
                  }}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{session.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Type</span>
              <span>
                {session.user.image?.includes("github") ||
                session.user.email?.endsWith("@users.noreply.github.com")
                  ? "GitHub"
                  : "Email/Password"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
