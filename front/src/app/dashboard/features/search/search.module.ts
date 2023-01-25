import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TimInputModule } from '@tim-mhn/ng-forms/input';
import { TimUIDropdownMenuModule } from '@tim-mhn/ng-ui/dropdown-menu';
import { TimUISpinnerModule } from '@tim-mhn/ng-ui/spinner';
import { TasksSearchBarComponent } from './components/tasks-search-bar/tasks-search-bar.component';
import { TasksSearchItemComponent } from './components/tasks-search-item/tasks-search-item.component';
import { SearchProvidersModule } from './search-providers.module';

@NgModule({
  imports: [
    CommonModule,
    SearchProvidersModule,
    TimInputModule,
    TimUIDropdownMenuModule,
    ReactiveFormsModule,
    TimUISpinnerModule,
  ],
  declarations: [TasksSearchBarComponent, TasksSearchItemComponent],
  exports: [TasksSearchBarComponent],
})
export class SearchModule {}
