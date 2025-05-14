"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, X } from "lucide-react";

interface Collaborator {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface ProjectCollaboratorsProps {
  projectId: string;
  isOwner: boolean;
}

export function ProjectCollaborators({
  projectId,
  isOwner,
}: ProjectCollaboratorsProps) {
  // We'll use router to refresh the page after operations
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);

  // Fetch collaborators when dialog opens
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      fetchCollaborators();
    }
  };

  // Fetch collaborators from API
  const fetchCollaborators = async () => {
    setIsLoadingCollaborators(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch collaborators");
      }

      const data = await response.json();
      setCollaborators(data.members || []);
    } catch (err) {
      console.error("Error fetching collaborators:", err);
      setError("Failed to load collaborators. Please try again.");
    } finally {
      setIsLoadingCollaborators(false);
    }
  };

  // Invite a collaborator
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to invite collaborator");
      }

      setSuccess("Collaborator invited successfully");
      setEmail("");
      fetchCollaborators(); // Refresh the collaborators list
      router.refresh(); // Refresh the page to update any UI that depends on collaborators
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while inviting the collaborator");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a collaborator
  const handleRemoveCollaborator = async (userId: string) => {
    if (!isOwner) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove collaborator");
      }

      setSuccess("Collaborator removed successfully");
      fetchCollaborators(); // Refresh the collaborators list
      router.refresh(); // Refresh the page to update any UI that depends on collaborators
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while removing the collaborator");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Users className="h-4 w-4" />
          Collaborators
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Collaborators</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <form onSubmit={handleInvite} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Invite by Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
              </div>
            </div>
          </form>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Team Members</h4>
          {isLoadingCollaborators ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No collaborators yet. Invite team members to collaborate.
            </p>
          ) : (
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {collaborator.name
                        ? collaborator.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {collaborator.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {collaborator.role}
                    </span>
                    {isOwner && collaborator.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.id)
                        }
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
