import React from "react";

import { EmailLayout } from "./email-layout";

interface ProjectInvitationEmailProps {
  name: string;
  inviterName: string;
  projectName: string;
  projectUrl: string;
}

export default function ProjectInvitationEmail({
  name,
  inviterName,
  projectName,
  projectUrl,
}: ProjectInvitationEmailProps) {
  return (
    <EmailLayout>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}
      >
        You've been invited to collaborate
      </h1>

      <p style={{ fontSize: "16px", lineHeight: "24px", margin: "16px 0" }}>
        Hello {name || "there"},
      </p>

      <p style={{ fontSize: "16px", lineHeight: "24px", margin: "16px 0" }}>
        <strong>{inviterName}</strong> has invited you to collaborate on the
        project <strong>"{projectName}"</strong> in TodoForDevs.
      </p>

      <div style={{ margin: "32px 0" }}>
        <a
          href={projectUrl}
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          View Project
        </a>
      </div>

      <p style={{ fontSize: "16px", lineHeight: "24px", margin: "16px 0" }}>
        You'll be able to view and edit tasks, add comments, and collaborate
        with the team.
      </p>

      <p style={{ fontSize: "16px", lineHeight: "24px", margin: "16px 0" }}>
        If you don't have an account yet, you'll need to create one using this
        email address to access the project.
      </p>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "24px",
          margin: "16px 0",
          color: "#666",
        }}
      >
        If you believe this invitation was sent by mistake, you can safely
        ignore this email.
      </p>
    </EmailLayout>
  );
}
