/*
  Warnings:

  - Added the required column `assignee_id` to the `task_assignation_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_assignation_notifications" ADD COLUMN     "assignee_id" TEXT NOT NULL;
