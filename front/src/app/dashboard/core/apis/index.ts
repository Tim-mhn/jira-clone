import { environment } from '../../../../environments/environment';

export const PROJECTS_API_ENDPOINT = `${environment.apiUrl}projects`;

export const buildTaskEndpoint = (ids: { projectId: string }) =>
  `${PROJECTS_API_ENDPOINT}/${ids.projectId}/tasks`;
