import { ProjectIdName } from '../models';

export function buildTaskPageRoute(
  task: { Id: string },
  project: ProjectIdName
): string[] {
  return ['/', 'projects', project.Id, 'browse', task.Id];
}
