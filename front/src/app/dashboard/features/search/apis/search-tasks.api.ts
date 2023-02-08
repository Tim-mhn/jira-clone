import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchProvidersModule } from '../search-providers.module';
import { environment } from '../../../../../environments/environment';
import { SearchResultsDTO } from '../dtos/search-task.dto';

@Injectable({
  providedIn: SearchProvidersModule,
})
export class SearchAPI {
  constructor(private http: HttpClient) {}

  readonly BASE_ENDPOINT = `${environment.apiUrl}search`;
  searchTasksSprintsByContent(searchText: string) {
    const endpoint = `${this.BASE_ENDPOINT}?content=${searchText}`;
    return this.http.get<SearchResultsDTO>(endpoint).pipe();
  }
}
