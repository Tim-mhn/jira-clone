import { SprintInfo, SprintWithTasks } from '../models/sprint';

export function getSprintsTaskDoesNotBelongTo(
  taskId: string,
  allSprints: SprintWithTasks[]
): SprintInfo[] {
  const taskSprint = allSprints.find(
    (sprintWithTasks) => !!sprintWithTasks.Tasks.find((t) => t.Id === taskId)
  );

  const taskSprintId = taskSprint.Sprint.Id;

  const otherSprints = allSprints
    .filter((sprintWithTasks) => sprintWithTasks.Sprint.Id !== taskSprintId)
    .map((s) => s.Sprint);

  return otherSprints;
}
