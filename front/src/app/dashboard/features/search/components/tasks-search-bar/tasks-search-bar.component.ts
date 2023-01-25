import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { RequestState } from '@tim-mhn/common/http';
import { TimUIDropdownMenu } from '@tim-mhn/ng-ui/dropdown-menu';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { SearchTasksController } from '../../controllers/search-tasks.controller';

@Component({
  selector: 'jira-tasks-search-bar',
  templateUrl: './tasks-search-bar.component.html',
  host: {
    class: 'flex flex-grow justify-end',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksSearchBarComponent implements OnInit {
  constructor(private controller: SearchTasksController) {}

  @ViewChild(TimUIDropdownMenu) dropdownMenu: TimUIDropdownMenu;

  searchControl = new FormControl('');
  requestState = new RequestState();

  hasFocus = false;

  hasAlreadyFetchedData = false;
  tasksList$ = this.searchControl.valueChanges.pipe(
    filter((searchText) => !!searchText),
    tap(() => this.requestState.toPending()),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((searchText) =>
      this.controller
        .searchTasksByContent(searchText, this.requestState)
        .pipe(catchError(() => EMPTY))
    ),
    tap(() => (this.hasAlreadyFetchedData = true)),
    shareReplay()
  );

  toggleFocus(hasFocus: boolean) {
    setTimeout(() => (this.hasFocus = hasFocus));
  }
  ngOnInit(): void {}

  // @HostListener('document:click')
  // @logMethod
  // closeMenuOnClick() {
  //   // this.dropdownMenu.close();
  // }
}
