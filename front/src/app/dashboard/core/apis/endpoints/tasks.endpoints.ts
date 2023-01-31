import { ProjectTaskIds } from '../../dtos/ids.dto';
import { PROJECTS_API_ENDPOINT } from './projects.endpoints';

export const buildTaskEndpoint = (ids: { projectId: string }) =>
  `${PROJECTS_API_ENDPOINT}/${ids.projectId}/tasks`;

export const buildSingleTaskEndpoint = (ids: ProjectTaskIds) => {
  const { projectId, taskId } = ids;
  return `${buildTaskEndpoint({ projectId })}/${taskId}`;
};
