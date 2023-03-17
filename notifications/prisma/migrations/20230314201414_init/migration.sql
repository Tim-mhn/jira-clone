-- CreateTable
CREATE TABLE "task_assignation_notifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,
    "project" JSONB NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "task_assignation_notifications_pkey" PRIMARY KEY ("id")
);
