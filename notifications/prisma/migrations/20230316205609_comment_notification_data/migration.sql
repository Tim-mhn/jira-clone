/*
  Warnings:

  - You are about to drop the column `comment` on the `comment_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `comment_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `comment_notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment_notifications" DROP CONSTRAINT "comment_notifications_authorUuid_fkey";

-- DropForeignKey
ALTER TABLE "comment_notifications" DROP CONSTRAINT "comment_notifications_taskProjectUuid_fkey";

-- AlterTable
ALTER TABLE "comment_notifications" DROP COLUMN "comment",
DROP COLUMN "created_at",
DROP COLUMN "taskId",
ADD COLUMN     "commentNotificationDataId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "authorUuid" DROP NOT NULL,
ALTER COLUMN "taskProjectUuid" DROP NOT NULL;

-- CreateTable
CREATE TABLE "comment_notification_data" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorUuid" TEXT NOT NULL,
    "taskProjectUuid" TEXT NOT NULL,

    CONSTRAINT "comment_notification_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comment_notification_data" ADD CONSTRAINT "comment_notification_data_taskProjectUuid_fkey" FOREIGN KEY ("taskProjectUuid") REFERENCES "projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notification_data" ADD CONSTRAINT "comment_notification_data_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "authors"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_commentNotificationDataId_fkey" FOREIGN KEY ("commentNotificationDataId") REFERENCES "comment_notification_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_taskProjectUuid_fkey" FOREIGN KEY ("taskProjectUuid") REFERENCES "projects"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "authors"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
