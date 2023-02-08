import { Injectable } from '@angular/core';
import { RequestState, RequestStateController } from '@tim-mhn/common/http';
import { SearchProvidersModule } from '../search-providers.module';
import { SearchAPI } from '../apis/search-tasks.api';
import { SearchText } from '../models/search-text';

@Injectable({
  providedIn: SearchProvidersModule,
})
export class SearchTasksController {
  constructor(
    private api: SearchAPI,
    private requestStateController: RequestStateController
  ) {}

  searchTasksSprintsByContent(
    searchText: SearchText,
    requestState?: RequestState
  ) {
    return this.api
      .searchTasksSprintsByContent(searchText)
      .pipe(this.requestStateController.handleRequest(requestState));
  }
}
