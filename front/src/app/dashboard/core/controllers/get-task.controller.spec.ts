import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { Observable, of } from 'rxjs';
import { GetTasksAPI } from '../apis/get-tasks.api';
import { TaskMapper } from '../mappers/task.mapper';
import { Project } from '../models';
import { CurrentProjectService } from '../state-services/current-project.service';
import { GetTaskController } from './get-task.controller';

describe('GetTaskController', () => {
  describe('getTask', () => {
    let controller: GetTaskController;

    let api: jasmine.SpyObj<GetTasksAPI>;
    let mapper: jasmine.SpyObj<TaskMapper>;
    let currentProjectService: CurrentProjectService;
    beforeEach(() => {
      const requestStateController = new RequestStateController();

      mapper = jasmine.createSpyObj('TaskMapper', ['toDomain']);
      currentProjectService = new CurrentProjectService();

      api = jasmine.createSpyObj('GetTasksAPI', ['getSingleTask']);
      api.getSingleTask.and.returnValue(of(<any>{}));

      controller = new GetTaskController(
        requestStateController,
        currentProjectService,
        api,
        mapper
      );
    });

    it('should  be created', () => {
      expect(controller).toBeDefined();
    });
    it('should work even if CurrentProjectService emits before getTask is called', (done: DoneFn) => {
      const p: Project = {
        Id: 'project-id',
      } as Project;
      currentProjectService.updateCurrentProject(p);

      const taskId = 'task-id';
      controller.getTask(taskId).subscribe(() => {
        expect(api.getSingleTask).toHaveBeenCalledWith({
          taskId,
          projectId: p.Id,
        });
        done();
      });
    });
  });
});
