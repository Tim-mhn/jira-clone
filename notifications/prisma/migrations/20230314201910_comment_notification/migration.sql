/*
  Warnings:

  - You are about to drop the column `createdAt` on the `task_assignation_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `task_assignation_notifications` table. All the data in the column will be lost.
  - Added the required column `task_id` to the `task_assignation_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_assignation_notifications" DROP COLUMN "createdAt",
DROP COLUMN "taskId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "task_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "comment_notifications" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "project" JSONB NOT NULL,
    "author" JSONB NOT NULL,
    "user_following_id" TEXT NOT NULL,

    CONSTRAINT "comment_notifications_pkey" PRIMARY KEY ("id")
);
