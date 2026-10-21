-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN "ip" TEXT;

-- CreateIndex
CREATE INDEX "Inquiry_ip_createdAt_idx" ON "Inquiry"("ip", "createdAt");
