import { Task } from '../models';
import { SprintInfo } from '../models/sprint';

export function getSprintsTaskDoesNotBelongTo(
  task: Task,
  allActiveSprints: SprintInfo[]
): SprintInfo[] {
  return allActiveSprints?.filter((sprint) => sprint.Id !== task?.SprintID);
}
