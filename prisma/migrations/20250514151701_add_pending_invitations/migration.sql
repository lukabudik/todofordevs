-- CreateTable
CREATE TABLE "PendingInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "PendingInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingInvitation_token_key" ON "PendingInvitation"("token");

-- CreateIndex
CREATE INDEX "PendingInvitation_projectId_idx" ON "PendingInvitation"("projectId");

-- CreateIndex
CREATE INDEX "PendingInvitation_inviterId_idx" ON "PendingInvitation"("inviterId");

-- CreateIndex
CREATE INDEX "PendingInvitation_token_idx" ON "PendingInvitation"("token");

-- CreateIndex
CREATE INDEX "PendingInvitation_email_idx" ON "PendingInvitation"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingInvitation_email_projectId_key" ON "PendingInvitation"("email", "projectId");

-- AddForeignKey
ALTER TABLE "PendingInvitation" ADD CONSTRAINT "PendingInvitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingInvitation" ADD CONSTRAINT "PendingInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
