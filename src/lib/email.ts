import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import React from "react";
import VerificationEmail from "@/components/email/verification-email";
import PasswordResetEmail from "@/components/email/password-reset-email";
import ProjectInvitationEmail from "@/components/email/project-invitation-email";
import crypto from "crypto";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email address
const DEFAULT_FROM_EMAIL = "TodoForDevs <notifications@todofordevs.com>";

// Email types
export const EMAIL_TYPES = {
  VERIFICATION: "VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
  INVITATION: "INVITATION",
  PENDING_INVITATION: "PENDING_INVITATION",
  TASK_ASSIGNMENT: "TASK_ASSIGNMENT",
  DUE_DATE_REMINDER: "DUE_DATE_REMINDER",
  WEEKLY_SUMMARY: "WEEKLY_SUMMARY",
};

/**
 * Send an email using Resend
 *
 * @param options Email sending options
 * @returns Result of the email sending operation
 */
export async function sendEmail({
  from = DEFAULT_FROM_EMAIL,
  to,
  subject,
  react,
  text,
  tags = [],
  type,
  userId,
  metadata,
}: {
  from?: string;
  to: string | string[];
  subject: string;
  react?: React.ReactNode;
  text?: string;
  tags?: { name: string; value: string }[];
  type: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    // Validate required fields
    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!react && !text) {
      throw new Error("Either react or text content is required");
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      text,
      tags,
    });

    // Handle errors
    if (error) {
      console.error("Error sending email:", error);
      const result = { success: false, error };

      // Log the email activity
      await logEmailActivity(type, from, to, subject, result, userId, metadata);

      return result;
    }

    const result = { success: true, data };

    // Log the email activity
    await logEmailActivity(type, from, to, subject, result, userId, metadata);

    return result;
  } catch (error) {
    console.error("Exception sending email:", error);
    const result = {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error sending email"),
    };

    // Log the email activity
    await logEmailActivity(type, from, to, subject, result, userId, metadata);

    return result;
  }
}

/**
 * Log email sending activity to the database
 *
 * @param type Type of email being sent
 * @param from Sender email address
 * @param to Recipient email address(es)
 * @param subject Email subject
 * @param result Result of the email sending operation
 * @param userId Optional user ID who triggered the email
 * @param metadata Optional additional metadata
 */
type EmailLogResult = {
  success: boolean;
  error?: Error | { [key: string]: unknown };
  data?: unknown;
};

export async function logEmailActivity(
  type: string,
  from: string,
  to: string | string[],
  subject: string,
  result: EmailLogResult,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  const recipient = Array.isArray(to) ? to.join(", ") : to;
  const status = result.success ? "SUCCESS" : "FAILED";
  const errorMessage = result.error
    ? result.error.message || JSON.stringify(result.error)
    : null;

  // Log to console for development
  console.log(
    `[EMAIL:${type}] To: ${recipient} | Subject: ${subject} | Status: ${status}${
      errorMessage ? `: ${errorMessage}` : ""
    }`
  );

  try {
    // Store in database using Prisma's create method
    await prisma.emailLog.create({
      data: {
        id: crypto.randomUUID(),
        type,
        sender: from,
        recipient,
        subject,
        status,
        errorMessage:
          typeof errorMessage === "string"
            ? errorMessage
            : errorMessage
              ? JSON.stringify(errorMessage)
              : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: (metadata || {}) as any,
        userId,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to log email to database:", error);
  }
}

/**
 * Get verification email React component
 *
 * @param name User's name
 * @param verificationUrl Verification URL
 * @returns React component for verification email
 */
function getVerificationEmailComponent(name: string, verificationUrl: string) {
  return React.createElement(VerificationEmail, {
    name,
    verificationUrl,
  });
}

/**
 * Get password reset email React component
 *
 * @param name User's name
 * @param resetUrl Password reset URL
 * @returns React component for password reset email
 */
function getPasswordResetEmailComponent(name: string, resetUrl: string) {
  return React.createElement(PasswordResetEmail, {
    name,
    resetUrl,
  });
}

/**
 * Get project invitation email React component
 *
 * @param name Invitee's name
 * @param inviterName Inviter's name
 * @param projectName Project name
 * @param projectUrl Project URL
 * @returns React component for project invitation email
 */
function getProjectInvitationEmailComponent(
  name: string,
  inviterName: string,
  projectName: string,
  projectUrl: string
) {
  return React.createElement(ProjectInvitationEmail, {
    name,
    inviterName,
    projectName,
    projectUrl,
  });
}

/**
 * Send a verification email to a user
 *
 * @param user User to send verification email to
 * @param token Verification token
 * @returns Result of the email sending operation
 */
export async function sendVerificationEmail(
  user: { id: string; email: string; name?: string | null },
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: user.email,
    subject: "Verify your TodoForDevs account",
    react: getVerificationEmailComponent(user.name || "", verificationUrl),
    text: `Hello ${
      user.name || "there"
    },\n\nPlease verify your email address by clicking the link below:\n\n${verificationUrl}\n\nIf you did not create an account, please ignore this email.\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.VERIFICATION,
    userId: user.id,
    metadata: { verificationUrl },
  });
}

/**
 * Send a password reset email to a user
 *
 * @param user User to send password reset email to
 * @param token Password reset token
 * @returns Result of the email sending operation
 */
export async function sendPasswordResetEmail(
  user: { id: string; email: string; name?: string | null },
  token: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: user.email,
    subject: "Reset your TodoForDevs password",
    react: getPasswordResetEmailComponent(user.name || "", resetUrl),
    text: `Hello ${
      user.name || "there"
    },\n\nYou requested to reset your password. Please click the link below to set a new password:\n\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email.\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.PASSWORD_RESET,
    userId: user.id,
    metadata: { resetUrl },
  });
}

/**
 * Send a project invitation email
 *
 * @param inviter User who sent the invitation
 * @param invitee User being invited
 * @param project Project being invited to
 * @returns Result of the email sending operation
 */
export async function sendProjectInvitationEmail(
  inviter: { id: string; name?: string | null; email: string },
  invitee: { id: string; email: string; name?: string | null },
  project: { id: string; name: string }
) {
  const projectUrl = `${process.env.NEXTAUTH_URL}/projects/${project.id}`;
  const inviterName = inviter.name || inviter.email;

  return sendEmail({
    to: invitee.email,
    subject: `You've been invited to collaborate on ${project.name}`,
    react: getProjectInvitationEmailComponent(
      invitee.name || "",
      inviterName,
      project.name,
      projectUrl
    ),
    text: `Hello ${invitee.name || "there"},\n\n${inviterName} has invited you to collaborate on the project "${
      project.name
    }" in TodoForDevs.\n\nYou can access the project by clicking the link below:\n\n${projectUrl}\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.INVITATION,
    userId: inviter.id,
    metadata: {
      projectId: project.id,
      projectName: project.name,
      inviteeId: invitee.id,
      projectUrl,
    },
  });
}

/**
 * Send a project invitation email to a non-existent user
 *
 * @param inviter User who sent the invitation
 * @param inviteeEmail Email of the person being invited (who doesn't have an account yet)
 * @param project Project being invited to
 * @param token Invitation token for registration
 * @returns Result of the email sending operation
 */
export async function sendPendingInvitationEmail(
  inviter: { id: string; name?: string | null; email: string },
  inviteeEmail: string,
  project: { id: string; name: string },
  token: string
) {
  const projectUrl = `${process.env.NEXTAUTH_URL}/projects/${project.id}`;
  const registerUrl = `${process.env.NEXTAUTH_URL}/register?invitation=${token}`;
  const inviterName = inviter.name || inviter.email;

  return sendEmail({
    to: inviteeEmail,
    subject: `You've been invited to collaborate on ${project.name}`,
    react: getProjectInvitationEmailComponent(
      "",
      inviterName,
      project.name,
      registerUrl
    ),
    text: `Hello,\n\n${inviterName} has invited you to collaborate on the project "${
      project.name
    }" in TodoForDevs.\n\nYou'll need to create an account to access this project. You can register using the link below:\n\n${registerUrl}\n\nAfter registering, you'll be able to access the project at:\n${projectUrl}\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.PENDING_INVITATION,
    userId: inviter.id,
    metadata: {
      projectId: project.id,
      projectName: project.name,
      inviteeEmail,
      invitationToken: token,
      registerUrl,
      projectUrl,
    },
  });
}

/**
 * Send a task assignment notification email
 *
 * @param assigner User who assigned the task
 * @param assignee User being assigned to the task
 * @param task Task being assigned
 * @param project Project the task belongs to
 * @returns Result of the email sending operation
 */
export async function sendTaskAssignmentEmail(
  assigner: { id: string; name?: string | null; email: string },
  assignee: { id: string; email: string; name?: string | null },
  task: {
    id: string;
    title: string;
    dueDate?: string | null;
    status: string;
    priority: string;
  },
  project: { id: string; name: string }
) {
  const taskUrl = `${process.env.NEXTAUTH_URL}/projects/${project.id}?taskId=${task.id}`;
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return sendEmail({
    to: assignee.email,
    subject: `Task assigned to you: ${task.title}`,
    text: `Hello ${assignee.name || "there"},\n\n${
      assigner.name || assigner.email
    } has assigned you a task in the project "${project.name}".\n\nTask: ${
      task.title
    }\nPriority: ${task.priority}\nStatus: ${
      task.status
    }\nDue Date: ${dueDate}\n\nYou can view the task by clicking the link below:\n\n${taskUrl}\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.TASK_ASSIGNMENT,
    userId: assigner.id,
    metadata: {
      taskId: task.id,
      taskTitle: task.title,
      taskStatus: task.status,
      taskPriority: task.priority,
      taskDueDate: task.dueDate,
      projectId: project.id,
      projectName: project.name,
      assigneeId: assignee.id,
      taskUrl,
    },
  });
}

/**
 * Send a due date reminder email
 *
 * @param user User to send the reminder to
 * @param task Task with approaching due date
 * @param project Project the task belongs to
 * @param daysRemaining Number of days remaining until the due date
 * @returns Result of the email sending operation
 */
export async function sendDueDateReminderEmail(
  user: { id: string; email: string; name?: string | null },
  task: {
    id: string;
    title: string;
    dueDate: string;
    status: string;
    priority: string;
  },
  project: { id: string; name: string },
  daysRemaining: number
) {
  const taskUrl = `${process.env.NEXTAUTH_URL}/projects/${project.id}?taskId=${task.id}`;
  const dueDate = new Date(task.dueDate).toLocaleDateString();

  return sendEmail({
    to: user.email,
    subject: `Reminder: Task due ${
      daysRemaining === 0 ? "today" : `in ${daysRemaining} days`
    } - ${task.title}`,
    text: `Hello ${
      user.name || "there"
    },\n\nThis is a reminder that your task "${task.title}" in the project "${
      project.name
    }" is due ${
      daysRemaining === 0 ? "today" : `in ${daysRemaining} days`
    } (${dueDate}).\n\nTask: ${task.title}\nPriority: ${
      task.priority
    }\nStatus: ${
      task.status
    }\nDue Date: ${dueDate}\n\nYou can view the task by clicking the link below:\n\n${taskUrl}\n\nThanks,\nThe TodoForDevs Team`,
    type: EMAIL_TYPES.DUE_DATE_REMINDER,
    userId: user.id,
    metadata: {
      taskId: task.id,
      taskTitle: task.title,
      taskStatus: task.status,
      taskPriority: task.priority,
      taskDueDate: task.dueDate,
      projectId: project.id,
      projectName: project.name,
      daysRemaining,
      taskUrl,
    },
  });
}
