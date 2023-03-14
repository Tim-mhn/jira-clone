/*
  Warnings:

  - You are about to drop the column `project` on the `comment_notifications` table. All the data in the column will be lost.
  - Added the required column `taskProjectUuid` to the `comment_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment_notifications" DROP COLUMN "project",
ADD COLUMN     "taskProjectUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_taskProjectUuid_fkey" FOREIGN KEY ("taskProjectUuid") REFERENCES "projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
