import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypedFormBuilder } from '@tim-mhn/common/typed-forms';
import { takeUntil } from 'rxjs';
import { objectValues } from '@tim-mhn/common/objects';
import {
  BoardFilters,
  ProjectMembers,
  TaskStatus,
} from '../../../../core/models';
import { SubscriptionHandler } from '../../../../../shared/services/subscription-handler.service';

@Component({
  selector: 'jira-board-filters',
  templateUrl: './board-filters.component.html',
})
export class BoardFiltersComponent implements OnInit {
  @Input() members: ProjectMembers = [];
  @Input() statusList: TaskStatus[];

  @Output() filtersChange = new EventEmitter<BoardFilters>();

  private _subHandler = new SubscriptionHandler();

  constructor(private tfb: TypedFormBuilder) {}

  filtersForm = this.tfb.group<BoardFilters>({
    assigneeId: this.tfb.control<string[]>([]),
    status: this.tfb.control<number[]>([]),
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
    };
    this.filtersForm.reset(initialBoardFilters);
  }

  private _emitFiltersFormChange() {
    this.filtersForm.valueChanges
      .pipe(takeUntil(this._subHandler.onDestroy$))
      .subscribe((filters) => this.filtersChange.emit(filters));
  }

  private _showResetFiltersIfValuesAreSelected() {
    this.filtersForm.valueChanges
      .pipe(takeUntil(this._subHandler.onDestroy$))
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
