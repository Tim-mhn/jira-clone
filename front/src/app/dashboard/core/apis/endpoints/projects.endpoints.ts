import { environment } from '../../../../../environments/environment';
import { ProjectId } from '../../models';

export const PROJECTS_API_ENDPOINT = `${environment.apiUrl}projects` as const;

export const buildSingleProjectEndpoint = (projectId: ProjectId) =>
  `${PROJECTS_API_ENDPOINT}/${projectId}`;
