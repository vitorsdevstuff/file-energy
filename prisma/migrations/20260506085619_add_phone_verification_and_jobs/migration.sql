/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneVerificationSentAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "payload" TEXT,
    "result" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
