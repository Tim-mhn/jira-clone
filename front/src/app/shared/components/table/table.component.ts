import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TableColumns, TableData } from './models/table';

@Component({
  selector: 'jira-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = any> implements OnInit {
  @Input() columns: TableColumns<T> = [];
  @Input() data: TableData<T>;
  @Input() loading: boolean;
  constructor() {}

  ngOnInit(): void {}
}
