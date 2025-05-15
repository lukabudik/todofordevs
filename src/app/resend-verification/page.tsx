"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSubmitState("error");
      setErrorMessage("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitState("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitState("error");
        setErrorMessage(data.message || "Failed to resend verification email");
        return;
      }

      setSubmitState("success");
    } catch (error) {
      console.error("Error resending verification email:", error);
      setSubmitState("error");
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Resend Verification Email
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address below and we'll send you a new verification
            link.
          </p>

          {submitState === "success" ? (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-xl font-semibold">Email Sent!</h2>
              <p className="text-center text-muted-foreground">
                We've sent a new verification link to your email address. Please
                check your inbox and follow the instructions to verify your
                account.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {submitState === "error" && (
                <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950 dark:text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
