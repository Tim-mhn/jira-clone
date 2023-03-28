import { Injectable } from '@angular/core';
import {
  MockAPI,
  RequestState,
  RequestStateController,
} from '@tim-mhn/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
import {
  SnackbarFeedbackOptions,
  SnackbarFeedbackService,
} from '../../../shared/services/snackbar-feedback.service';
import { logMethod } from '../../../shared/utils/log-method.decorator';
import { SprintsAPI } from '../apis/sprints.api';
import { DashboardCoreProvidersModule } from '../core.providers.module';
import { SprintMapper } from '../mappers/sprint.mapper';
import { Sprint } from '../models';
import { UpdateSprint } from '../models/update-sprint';
import { CurrentProjectService } from '../state-services/current-project.service';

@Injectable({
  providedIn: DashboardCoreProvidersModule,
})
export class SprintController {
  constructor(
    private requestStateController: RequestStateController,
    private currentProjectService: CurrentProjectService,
    private snackbarFeedback: SnackbarFeedbackService,
    private api: SprintsAPI,
    private mapper: SprintMapper,
    private mockAPI: MockAPI
  ) {}

  createSprint(sprintName: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.createSprint({ sprintName, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Creating sprint ...',
        successMessage: 'Sprint successfully created',
      }),
      this.requestStateController.handleRequest(requestState)
    );
  }

  getSprint(sprintId: string, requestState?: RequestState): Observable<Sprint> {
    const { currentProject$ } = this.currentProjectService;

    return currentProject$.pipe(
      switchMap((project) =>
        this.api.getSprint({ projectId: project.Id, sprintId })
      ),
      map((dto) => this.mapper.toDomain(dto)),
      this.requestStateController.handleRequest(requestState)
    );
  }

  deleteSprint(sprintId: string, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.deleteSprint({ sprintId, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars({
        loadingMessage: 'Deleting sprint ...',
        successMessage: 'Sprint successfully deleted',
      }),
      this.requestStateController.handleRequest(requestState)
    );
  }

  @logMethod
  completeSprintAndShowSnackbarWithUndoAction(
    sprint: Sprint,
    requestState?: RequestState
  ) {
    const projectId = this._currentProjectId;

    const options: SnackbarFeedbackOptions = {
      showLoadingMessage: false,
      undoAction: () => this._undoSprintCompletion(sprint).subscribe(),
    };
    return this.api.completeSprint({ sprintId: sprint.Id, projectId }).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage: 'Sprint successfully completed',
        },
        options
      ),
      tap(() => sprint.markAsComplete()),
      this.requestStateController.handleRequest(requestState)
    );
  }

  // todo: use actual API call (when available)
  // todo: handle how to not refresh the list ? recall the /tasks endpoint ? Not call it initially ?
  private _undoSprintCompletion(sprint: Sprint) {
    return this.mockAPI.post(null, null, { errorRate: 0 }).pipe(
      tap(() => sprint.reactive()),
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage: `Sprint '${sprint.Name}' is active again`,
        },
        {
          showLoadingMessage: false,
        }
      )
    );
  }

  reactiveSprintAndUpdateState(sprint: Sprint, requestState?: RequestState) {
    const projectId = this._currentProjectId;

    return this.api.reactiveSprint({ projectId, sprintId: sprint.Id }).pipe(
      tap(() => sprint.reactive()),
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage:
            'Sprint has been marked as active and is now visible in the board',
        },
        { showLoadingMessage: false }
      ),
      this.requestStateController.handleRequest(requestState)
    );
  }

  updateSprintAndUpdateState(
    sprint: Sprint,
    updateSprint: UpdateSprint,
    requestState?: RequestState
  ) {
    const projectId = this._currentProjectId;

    const dto = this.mapper.updateSprintToDTO(updateSprint);

    return this.api.updateSprint({ projectId, sprintId: sprint.Id }, dto).pipe(
      this.requestStateController.handleRequest(requestState),
      this.snackbarFeedback.showFeedbackSnackbars(),
      tap(() => {
        sprint.updateName(updateSprint.name);
        sprint.updateStartEndDates({
          start: updateSprint?.startDate,
          end: updateSprint?.endDate,
        });
      })
    );
  }
  private get _currentProjectId() {
    return this.currentProjectService.currentProject.Id;
  }
}
