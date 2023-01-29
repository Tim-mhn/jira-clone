export type NewTaskDTO = {
  points?: number;
  projectId: string;
  title?: string;
  assigneeId?: string;
  description?: string;
  sprintId: string;
  type?: number;
};
