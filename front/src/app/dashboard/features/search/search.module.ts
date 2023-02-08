import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimUIDividerModule } from '@tim-mhn/ng-ui/divider';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { SearchResultItemUiComponent } from './components/search-result-item-ui/search-result-item-ui.component';
import { SprintSearchItemComponent } from './components/sprint-search-item/sprint-search-item.component';
import { TasksSearchItemComponent } from './components/tasks-search-item/tasks-search-item.component';
import { SearchProvidersModule } from './search-providers.module';
import { GlobalSearchBarComponent } from './components/global-search-bar/global-search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    SearchProvidersModule,
    TimInputModule,
    TimUIDropdownMenuModule,
    ReactiveFormsModule,
    TimUISpinnerModule,
    RouterModule,
    TimUIDividerModule,
  ],
  declarations: [
    GlobalSearchBarComponent,
    TasksSearchItemComponent,
    SearchResultItemUiComponent,
    SprintSearchItemComponent,
  ],
  exports: [GlobalSearchBarComponent],
})
export class SearchModule {}
