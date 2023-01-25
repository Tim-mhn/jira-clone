import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { map } from 'rxjs';
import { SearchProvidersModule } from '../search-providers.module';
import { SearchTasksAPI } from '../apis/search-tasks.api';
import { SearchText } from '../models/search-text';

@Injectable({
  providedIn: SearchProvidersModule,
})
export class SearchTasksController {
  constructor(
    private api: SearchTasksAPI,
    private requestStateController: RequestStateController
  ) {}

  searchTasksByContent(searchText: SearchText, requestState?: RequestState) {
    return this.api
      .searchTasksByContent(searchText)

      .pipe(
        map((tasks) =>
          tasks?.map((t) => ({
            ...t,
            Project: { Name: 'Web platform', Id: '' },
          }))
        ),
        this.requestStateController.handleRequest(requestState)
      );
  }
}