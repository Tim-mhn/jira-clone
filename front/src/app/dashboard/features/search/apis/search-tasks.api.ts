import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SearchProvidersModule } from '../search-providers.module';
import { environment } from '../../../../../environments/environment';
import { SearchTaskDTO } from '../dtos/search-task.dto';

@Injectable({
  providedIn: SearchProvidersModule,
})
export class SearchTasksAPI {
  constructor(private http: HttpClient) {}

  readonly BASE_ENDPOINT = `${environment.apiUrl}search`;
  searchTasksByContent(searchText: string) {
    const endpoint = `${this.BASE_ENDPOINT}?content=${searchText}`;
    return this.http
      .get<SearchTaskDTO[]>(endpoint)
      .pipe(map((taskInfoList) => taskInfoList || []));
  }
}
