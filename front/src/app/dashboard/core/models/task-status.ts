export type TaskStatusColor = 'neutral' | 'primary' | 'success';
export interface TaskStatus {
  Id: number;
  Label: string;
  Color: TaskStatusColor;
}
