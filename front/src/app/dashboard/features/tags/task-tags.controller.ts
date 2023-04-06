import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { TagTemplateBuilder } from '@tim-mhn/ng-forms/autocomplete';
import {
  combineLatest,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { SnackbarFeedbackService } from '../../../shared/services/snackbar-feedback.service';
import { CurrentProjectService } from '../../core/state-services/current-project.service';
import { TaskTag } from './task-tag';
import { TaskTagsAPI } from './task-tags.api';

@Injectable()
export class TaskTagsController {
  constructor(
    private api: TaskTagsAPI,
    private _currentProjectService: CurrentProjectService,
    private _requestStateController: RequestStateController,
    private snackbarFeedback: SnackbarFeedbackService
  ) {}

  private _tagTemplateFn$ = this._currentProjectService.currentProject$.pipe(
    switchMap((project) => this.api.getTagTemplate({ projectId: project.Id })),
    map((tagTemplate) => {
      const fn = (tag: string) => tagTemplate.replace('{{TAG}}', tag);
      return fn;
    }),
    shareReplay()
  );

  getTagTemplateFn(): Observable<TagTemplateBuilder> {
    return this._tagTemplateFn$;
  }

  private _refetchProjectTags$ = new Subject<void>();

  createTagAndUpdateList(tag: TaskTag, requestState?: RequestState) {
    const projectId = this.currentProjectId;
    return this.api.createTag({ projectId }, tag).pipe(
      this.snackbarFeedback.showFeedbackSnackbars(
        {
          successMessage: `New tag "${tag}" successfully created`,
        },
        {
          showLoadingMessage: false,
        }
      ),
      tap(() => this._refetchTags()),
      this._requestStateController.handleRequest(requestState)
    );
  }

  private _refetchTags() {
    this._refetchProjectTags$.next();
  }

  private _projectTags$ = this._buildProjectTags$();

  private _buildProjectTags$() {
    const projectId$ = this._currentProjectService.currentProject$.pipe(
      map((p) => p.Id)
    );
    const refetch$ = this._refetchProjectTags$.pipe(startWith(null));

    return combineLatest({ projectId: projectId$, refetch: refetch$ }).pipe(
      switchMap(({ projectId }) => this.api.getProjectTags({ projectId })),
      shareReplay()
    );
  }

  getProjectTags() {
    return this._projectTags$;
  }

  private get currentProjectId() {
    return this._currentProjectService.currentProject.Id;
  }
}
