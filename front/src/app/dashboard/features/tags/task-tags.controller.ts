import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { TagTemplateBuilder } from '@tim-mhn/ng-forms/autocomplete';
import { map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { CurrentProjectService } from '../../core/state-services/current-project.service';
import { TaskTagsAPI } from './task-tags.api';

// todo: fix this DI issue
@Injectable()
export class TaskTagsController {
  constructor(
    private api: TaskTagsAPI,
    private _currentProjectService: CurrentProjectService,
    private _requestStateController: RequestStateController
  ) {
    console.log('TaskTagsController');
  }

  private _tagTemplateFn$ = this._currentProjectService.currentProject$.pipe(
    switchMap((project) => this.api.getTagTemplate({ projectId: project.Id })),
    tap(console.log),
    map((tagTemplate) => {
      const fn = (tag: string) => tagTemplate.replace('{{TAG}}', tag);
      return fn;
    }),
    shareReplay()
  );

  getTagTemplateFn(): Observable<TagTemplateBuilder> {
    return this._tagTemplateFn$;
  }

  createTagForProject(tag: string, requestState?: RequestState) {
    const projectId = this.currentProjectId;
    return this.api
      .createTag({ projectId }, tag)
      .pipe(this._requestStateController.handleRequest(requestState));
  }

  private _projectTags$ = this._currentProjectService.currentProject$.pipe(
    switchMap((project) => this.api.getProjectTags({ projectId: project.Id })),
    shareReplay()
  );

  getProjectTags() {
    return this._projectTags$;
  }

  private get currentProjectId() {
    return this._currentProjectService.currentProject.Id;
  }
}
