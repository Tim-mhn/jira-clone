import { ProjectIdName } from '../../../core/models';
import { TaskInfo } from '../../search/models/task-info';
import {
  buildTaskPageRoute,
  buildSprintPageRoute,
} from './build-browse-page-routes.util';
describe('buildTaskPageRoute', () => {
  it('should build the correct route', () => {
    const task: TaskInfo = {
      Id: 'random-task-id',
    } as TaskInfo;

    const project: ProjectIdName = {
      Id: 'project-id',
      Name: 'project name',
    };

    const route = buildTaskPageRoute(task, project);

    expect(route).toEqual([
      '/',
      'projects',
      'project-id',
      'browse',
      'tasks',
      'random-task-id',
    ]);
  });
});

describe('buildSprintPageRoute', () => {
  it('should build the correct route', () => {
    const project: ProjectIdName = {
      Id: 'project-id',
      Name: 'project name',
    };

    const route = buildSprintPageRoute(
      {
        Id: 'id-of-sprint',
      },
      project
    );

    expect(route).toEqual([
      '/',
      'projects',
      'project-id',
      'browse',
      'sprints',
      'id-of-sprint',
    ]);
  });
});
