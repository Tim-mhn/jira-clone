/*
  Warnings:

  - You are about to drop the column `author` on the `comment_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `task_assignation_notifications` table. All the data in the column will be lost.
  - Added the required column `authorUuid` to the `comment_notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskProjectUuid` to the `task_assignation_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment_notifications" DROP COLUMN "author",
ADD COLUMN     "authorUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_assignation_notifications" DROP COLUMN "project",
ADD COLUMN     "taskProjectUuid" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "task_followers" (
    "id" SERIAL NOT NULL,
    "task_id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,

    CONSTRAINT "task_followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "uuid" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "authors" (
    "uuid" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_followers_task_id_follower_id_key" ON "task_followers"("task_id", "follower_id");

-- AddForeignKey
ALTER TABLE "task_assignation_notifications" ADD CONSTRAINT "task_assignation_notifications_taskProjectUuid_fkey" FOREIGN KEY ("taskProjectUuid") REFERENCES "projects"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_notifications" ADD CONSTRAINT "comment_notifications_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "authors"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
