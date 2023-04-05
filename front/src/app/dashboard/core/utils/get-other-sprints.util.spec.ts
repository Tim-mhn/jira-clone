import { SprintInfo, Task } from '../models';
import { getSprintsTaskDoesNotBelongTo } from './get-other-sprints.util';

describe('getSprintsTaskDoesNotBelongTo', () => {
  let sprints: SprintInfo[];
  let sprint1: SprintInfo;
  let sprint2: SprintInfo;
  let sprint3: SprintInfo;
  beforeEach(() => {
    sprint1 = {
      Id: '1',
      IsBacklog: false,
      Name: 'sprint1',
    } as SprintInfo;
    sprint2 = {
      Id: '2',
      IsBacklog: false,
      Name: 'sprint2',
    } as SprintInfo;
    sprint3 = {
      Id: '3',
      IsBacklog: false,
      Name: 'sprint3',
    } as SprintInfo;
    sprints = [sprint1, sprint2, sprint3];
  });
  it('should return every sprint except the one the task belongs to', () => {
    const sprintInfo = {
      ...sprint2,
    };
    const task: Task = new Task({
      Assignee: null,
      Description: '',
      Id: 'task-id',
      Key: '',
      Points: 1,
      Sprint: sprintInfo,
      Status: null,
      Title: 'title',
      RawTitle: 'title',
      Type: {
        Color: 'primary',
        Icon: 'check',
        Label: 'Story',
        Id: 1,
      },
      Tags: [],
    });

    const allSprintsExceptSprint2 = getSprintsTaskDoesNotBelongTo(
      task,
      sprints
    );

    expect(allSprintsExceptSprint2).toEqual([sprint1, sprint3]);
  });

  it('should return all sprints if task is null', () => {
    const task = null as Task;

    expect(getSprintsTaskDoesNotBelongTo(task, sprints)).toEqual(sprints);
  });
});
