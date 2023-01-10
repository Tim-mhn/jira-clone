import { NewTaskDTO } from './new-task.dto';

export type PatchTaskDTO = Omit<NewTaskDTO, 'sprintId'> & {
  taskId: string;
  status?: number;
};
