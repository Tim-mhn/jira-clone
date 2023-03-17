/*
  Warnings:

  - Added the required column `taskId` to the `comment_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment_notifications" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "taskId" TEXT NOT NULL;
