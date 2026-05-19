-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phoneVerificationCodeAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phoneVerificationSendCount" INTEGER NOT NULL DEFAULT 0;
