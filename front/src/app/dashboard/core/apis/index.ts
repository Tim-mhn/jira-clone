import { environment } from '../../../../environments/environment';

export const PROJECTS_API_ENDPOINT = `${environment.apiUrl}projects` as const;

export const buildTaskEndpoint = (ids: { projectId: string }) =>
  `${PROJECTS_API_ENDPOINT}/${ids.projectId}/tasks`;

export const buildSingleTaskEndpoint = (ids: {
  projectId: string;
  taskId: string;
}) => {
  const { projectId, taskId } = ids;
  return `${buildTaskEndpoint({ projectId })}/${taskId}`;
};
