import * as React from "react";
import EmailLayout from "./email-layout";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<
  Readonly<PasswordResetEmailProps>
> = ({ name, resetUrl }) => (
  <EmailLayout previewText="Reset your TodoForDevs password">
    <h2
      style={{
        color: "#111827",
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 20px 0",
      }}
    >
      Password Reset Request
    </h2>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      Hello {name || "there"},
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      We received a request to reset your password for your TodoForDevs account.
      If you didn't make this request, you can safely ignore this email.
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      To reset your password, click the button below. This link will expire in
      24 hours.
    </p>

    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <a
        href={resetUrl}
        style={{
          backgroundColor: "#4F46E5",
          borderRadius: "4px",
          color: "#ffffff",
          display: "inline-block",
          fontSize: "16px",
          fontWeight: "bold",
          lineHeight: "1",
          padding: "12px 24px",
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        Reset Password
      </a>
    </div>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      Or copy and paste this URL into your browser:
    </p>

    <p
      style={{
        color: "#4F46E5",
        fontSize: "14px",
        lineHeight: "20px",
        margin: "0 0 24px 0",
        wordBreak: "break-all",
        fontFamily: "monospace",
        padding: "12px",
        backgroundColor: "#F3F4F6",
        borderRadius: "4px",
      }}
    >
      {resetUrl}
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      If you didn't request a password reset, no action is required. Your
      password will remain unchanged.
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0",
      }}
    >
      Thanks,
      <br />
      The TodoForDevs Team
    </p>
  </EmailLayout>
);

export default PasswordResetEmail;
