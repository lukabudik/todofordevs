"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CliAuthPage() {
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
    } catch (error) {
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">CLI Authentication</h1>

      {success ? (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p className="text-green-800">
            Authentication successful! You can now return to the CLI.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4">
            Enter the code displayed in your CLI to authenticate.
          </p>

          {error && (
            <div className="bg-red-100 p-4 rounded mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="userCode" className="block mb-2">
                Authentication Code
              </Label>
              <Input
                type="text"
                id="userCode"
                value={userCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter code (e.g., ABC123)"
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
