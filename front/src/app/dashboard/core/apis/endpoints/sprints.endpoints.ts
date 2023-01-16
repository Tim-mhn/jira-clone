import { PROJECTS_API_ENDPOINT } from './projects.endpoints';

export const buildSprintsEndpoint = (ids: { projectId: string }) =>
  `${PROJECTS_API_ENDPOINT}/${ids.projectId}/sprints`;

export const buildSingleSprintsEndpoint = (ids: {
  projectId: string;
  sprintId: string;
}) => {
  const { projectId, sprintId } = ids;
  return `${buildSprintsEndpoint({ projectId })}/${sprintId}`;
};
