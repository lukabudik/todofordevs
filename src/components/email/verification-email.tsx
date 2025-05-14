import * as React from "react";
import EmailLayout from "./email-layout";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
  name,
  verificationUrl,
}) => (
  <EmailLayout previewText="Verify your TodoForDevs account">
    <h2
      style={{
        color: "#111827",
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 20px 0",
      }}
    >
      Verify your email address
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
      Thanks for signing up for TodoForDevs! Please verify your email address by
      clicking the button below:
    </p>

    <div style={{ textAlign: "center", margin: "32px 0" }}>
      <a
        href={verificationUrl}
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
        Verify Email Address
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
      {verificationUrl}
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      If you did not create an account, please ignore this email.
    </p>

    <p
      style={{
        color: "#374151",
        fontSize: "16px",
        lineHeight: "24px",
        margin: "0 0 24px 0",
      }}
    >
      This verification link will expire in 24 hours.
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

export default VerificationEmail;
