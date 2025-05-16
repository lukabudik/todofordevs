"use client";

import { AlertCircle, CheckCircle, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CliAuthContent() {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call the API to verify the user code
      const response = await fetch("/api/auth/cli-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCode: userCode.toUpperCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify code");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (_error) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setUserCode(value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            CLI Authentication
          </h1>

          <div className="mt-8 flex flex-col items-center justify-center">
            {success ? (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-xl font-semibold">
                  Authentication Successful!
                </h2>
                <p className="text-center text-muted-foreground">
                  You have successfully authenticated with the CLI. You can now
                  return to your terminal.
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="mt-4 w-full"
                >
                  Continue to Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Terminal className="h-16 w-16 text-primary" />
                <p className="text-center text-muted-foreground">
                  Enter the code displayed in your CLI to authenticate.
                </p>

                {error && (
                  <div className="flex w-full items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userCode">Authentication Code</Label>
                    <Input
                      type="text"
                      id="userCode"
                      value={userCode}
                      onChange={handleInputChange}
                      placeholder="Enter code (e.g., ABC123)"
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CliAuthPage() {
  return (
    <Suspense>
      <CliAuthContent />
    </Suspense>
  );
}
