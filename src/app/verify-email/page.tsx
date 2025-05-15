"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { Suspense } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const needsVerification = searchParams.get("needsVerification") === "true";
  const { data: session } = useSession();

  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error" | "needs_verification"
  >(needsVerification ? "needs_verification" : "loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (needsVerification) {
      return;
    }

    if (!token) {
      setVerificationState("error");
      setErrorMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setVerificationState("error");
          setErrorMessage(data.message || "Failed to verify email");
          return;
        }

        setVerificationState("success");

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login?verificationSuccess=true");
        }, 2000);
      } catch (error) {
        console.error("Error verifying email:", error);
        setVerificationState("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    verifyEmail();
  }, [token, needsVerification, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Email Verification
          </h1>

          <div className="mt-8 flex flex-col items-center justify-center">
            {verificationState === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Verifying your email...</p>
              </div>
            )}

            {verificationState === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-xl font-semibold">Email Verified!</h2>
                <p className="text-center text-muted-foreground">
                  Your email has been successfully verified. You can now access
                  all features of TodoForDevs.
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link href="/login">Continue to Login</Link>
                </Button>
              </div>
            )}

            {verificationState === "needs_verification" && (
              <div className="flex flex-col items-center space-y-4">
                <Mail className="h-16 w-16 text-blue-500" />
                <h2 className="text-xl font-semibold">Verification Required</h2>
                <p className="text-center text-muted-foreground">
                  Your email address needs to be verified before you can access
                  all features. Please check your inbox for a verification email
                  we sent when you registered.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  If you can't find the email, check your spam folder or request
                  a new verification email.
                </p>
                <div className="mt-4 flex w-full flex-col space-y-2">
                  <Button asChild>
                    <Link href="/resend-verification">
                      Resend Verification Email
                    </Link>
                  </Button>
                  {session && (
                    <Button asChild variant="outline">
                      <Link href="/logout">Logout</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {verificationState === "error" && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <h2 className="text-xl font-semibold">Verification Failed</h2>
                <p className="text-center text-muted-foreground">
                  {errorMessage ||
                    "We couldn't verify your email. The verification link may have expired or is invalid."}
                </p>
                <div className="mt-4 flex w-full flex-col space-y-2">
                  <Button asChild variant="outline">
                    <Link href="/login">Go to Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/resend-verification">
                      Resend Verification Email
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
