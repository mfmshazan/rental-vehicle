-- CreateTable
CREATE TABLE "AuthAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "email" TEXT,
    "ip" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "AuthAttempt_email_createdAt_idx" ON "AuthAttempt"("email", "createdAt");

-- CreateIndex
CREATE INDEX "AuthAttempt_ip_createdAt_idx" ON "AuthAttempt"("ip", "createdAt");
