/*
  Warnings:

  - You are about to drop the column `task_name` on the `comment_notification_data` table. All the data in the column will be lost.
  - You are about to drop the column `task_name` on the `task_assignation_notifications` table. All the data in the column will be lost.
  - Added the required column `task_title` to the `comment_notification_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_title` to the `task_assignation_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment_notification_data" RENAME COLUMN "tsak_title" TO "task_title";

