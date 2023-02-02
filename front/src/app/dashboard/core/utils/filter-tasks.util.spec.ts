import {
  BoardFilters,
  ITask,
  ProjectMember,
  Task,
  Tasks,
  TaskStatus,
  TaskType,
} from '../models';
import { filterTasks } from './filter-tasks.util';

describe('filterTasks', () => {
  let initialTasks: Tasks = [];
  const STORY: TaskType = {
    Color: 'primary',
    Icon: 'check',
    Id: 1,
    Label: 'story',
  };

  const BUG: TaskType = {
    Color: 'destructive',
    Icon: 'check',
    Id: 2,
    Label: 'bug',
  };

  const assignee1: ProjectMember = {
    Email: '',
    Icon: '',
    Id: 'assignee1-id',
    Name: 'assignee 1',
  };

  const assignee2: ProjectMember = {
    Email: '',
    Icon: '',
    Id: 'assignee2-id',
    Name: 'assignee 2',
  };

  const NEW: TaskStatus = {
    Color: 'neutral',
    Id: 1,
    Label: 'new',
  };

  const IN_PROGRESS: TaskStatus = {
    Color: 'neutral',
    Id: 2,
    Label: 'in progress',
  };

  const DONE: TaskStatus = {
    Color: 'neutral',
    Id: 3,
    Label: 'done',
  };

  let task1: Task;
  let task2: Task;
  let task3: Task;
  let task4: Task;

  beforeEach(() => {
    task1 = buildTask({
      Id: '1',
      Type: STORY,
      Assignee: assignee1,
      Status: DONE,
    });
    task2 = buildTask({
      Id: '2',
      Type: BUG,
      Assignee: assignee1,
      Status: DONE,
    });
    task3 = buildTask({
      Id: '3',
      Type: BUG,
      Assignee: assignee1,
      Status: IN_PROGRESS,
    });
    task4 = buildTask({
      Id: '4',
      Type: STORY,
      Assignee: assignee2,
      Status: NEW,
    });

    initialTasks = [task1, task2, task3, task4];
  });

  describe('it should return all tasks if there are no filters', () => {
    it('filters = null', () => {
      const filteredTasks = filterTasks(initialTasks, null);
      expect(filteredTasks).toEqual(initialTasks);
    });

    it('all filters value are empty arrays', () => {
      const filteredTasks = filterTasks(initialTasks, {
        assigneeId: [],
        status: [],
        type: [],
      });
      expect(filteredTasks).toEqual(initialTasks);
    });
  });

  describe('it should only keep tasks with correct TaskType', () => {
    it('example 1 ', () => {
      const BUG_FILTER: BoardFilters = {
        type: [BUG.Id],
      };

      const filteredTasks = filterTasks(initialTasks, BUG_FILTER);

      expect(filteredTasks).toEqual([task2, task3]);
    });

    it('example 1 ', () => {
      const filters: BoardFilters = {
        type: [BUG.Id, STORY.Id],
      };

      const filteredTasks = filterTasks(initialTasks, filters);

      expect(filteredTasks).toEqual(initialTasks);
    });
  });

  it('it should only keep tasks with correct assignees', () => {
    const ASSIGNEE_FILTER: BoardFilters = {
      assigneeId: [assignee2.Id],
    };

    const filteredTasks = filterTasks(initialTasks, ASSIGNEE_FILTER);

    expect(filteredTasks).toEqual([task4]);
  });

  it('it should only keep tasks with correct status', () => {
    const STATUS_FILTER: BoardFilters = {
      status: [NEW.Id],
    };

    const filteredTasks = filterTasks(initialTasks, STATUS_FILTER);

    expect(filteredTasks).toEqual([task4]);
  });

  describe('multiple filters: it should only return tasks that match ALL filters', () => {
    it('2 filters', () => {
      const STATUS_FILTER: BoardFilters = {
        status: [DONE.Id],
        type: [STORY.Id],
      };

      const filteredTasks = filterTasks(initialTasks, STATUS_FILTER);

      expect(filteredTasks).toEqual([task1]);
    });

    it('3 filters', () => {
      const STATUS_FILTER: BoardFilters = {
        status: [DONE.Id],
        type: [STORY.Id],
        assigneeId: [assignee2.Id],
      };

      const filteredTasks = filterTasks(initialTasks, STATUS_FILTER);

      expect(filteredTasks).toEqual([]);
    });
  });

  it('should ignore filters with empty arrays', () => {
    const filters: BoardFilters = {
      status: [DONE.Id],
      type: [],
    };

    const filteredTasks = filterTasks(initialTasks, filters);

    expect(filteredTasks).toEqual([task1, task2]);
  });
});

function buildTask(props: {
  Id: string;
  Type: TaskType;
  Assignee: ProjectMember;
  Status: TaskStatus;
}) {
  const { Id, Type, Assignee, Status } = props;
  return new Task({
    Id,
    Key: '',
    Description: '',
    Points: 1,
    Sprint: null,
    Assignee,
    Type,
    Title: '',
    Status,
  });
}
