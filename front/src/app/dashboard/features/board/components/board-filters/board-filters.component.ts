import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { debounceTime, finalize, takeUntil } from 'rxjs';
import { objectValues } from '@tim-mhn/common/objects';
import {
  BoardFilters,
  ProjectMembers,
  TaskStatus,
  TaskType,
} from '../../../../core/models';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';

@Component({
  selector: 'jira-board-filters',
  templateUrl: './board-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardFiltersComponent implements OnInit {
  @Input() members: ProjectMembers = [];
  @Input() statusList: TaskStatus[];
  @Input() typeList: TaskType[];

  @Output() filtersChange = new EventEmitter<BoardFilters>();

  private _subHandler = new SubscriptionHandler();

  constructor(private tfb: TypedFormBuilder, private cdr: ChangeDetectorRef) {}

  filtersForm = this.tfb.group<BoardFilters>({
    assigneeId: this.tfb.control<string[]>([]),
    status: this.tfb.control<number[]>([]),
    type: this.tfb.control<number[]>([]),
  });

  showResetFiltersButton = false;

  ngOnInit(): void {
    this._emitFiltersFormChange();
    this._showResetFiltersIfValuesAreSelected();
  }

  resetForm() {
    // ensure to have empty arrays instead of null values
    const initialBoardFilters: BoardFilters = {
      assigneeId: [],
      status: [],
      type: [],
    };
    this.filtersForm.reset(initialBoardFilters);
  }

  private _emitFiltersFormChange() {
    const DEBOUNCE_TO_IMPROVE_RENDERING_PERFORMANCE = 200;
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TO_IMPROVE_RENDERING_PERFORMANCE),
        takeUntil(this._subHandler.onDestroy$)
      )
      .subscribe((filters) => this.filtersChange.emit(filters));
  }

  private _showResetFiltersIfValuesAreSelected() {
    this.filtersForm.valueChanges
      .pipe(
        takeUntil(this._subHandler.onDestroy$),
        finalize(() => this.cdr.detectChanges())
      )
      .subscribe((filters) => {
        const someFiltersAreSelected = objectValues(filters)?.some(
          (selectedValues) => selectedValues?.length > 0
        );

        this.showResetFiltersButton = someFiltersAreSelected;
      });
  }

  ngOnDestroy() {
    this._subHandler.destroy();
  }
}
