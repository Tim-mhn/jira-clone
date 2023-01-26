import { TaskInfo } from '../../features/search/models/task-info';
import { ITask, ProjectIdName, Task } from '../models';
import { buildTaskPageRoute } from './build-task-page-route.util';
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
      'random-task-id',
    ]);
  });
});
