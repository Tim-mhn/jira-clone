import { NewTaskDTO } from './new-task.dto';

export type PatchTaskDTO = Partial<NewTaskDTO> & {
  projectId: string;
  taskId: string;
  status?: number;
};
