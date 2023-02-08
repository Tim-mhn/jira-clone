import { ProjectIdName } from '../../../core/models';

function buildBrowsePageRoute(ids: { projectId: string }) {
  const { projectId } = ids;
  return ['/', 'projects', projectId, 'browse'];
}

export function buildTaskPageRoute(
  task: { Id: string },
  project: ProjectIdName
): string[] {
  const browseRoute = buildBrowsePageRoute({ projectId: project.Id });
  return [...browseRoute, 'tasks', task.Id];
}

export function buildSprintPageRoute(
  sprint: { Id: string },
  project: ProjectIdName
): string[] {
  const browseRoute = buildBrowsePageRoute({ projectId: project.Id });
  return [...browseRoute, 'sprints', sprint.Id];
}
