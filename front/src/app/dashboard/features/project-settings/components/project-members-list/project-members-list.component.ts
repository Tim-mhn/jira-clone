import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICONS } from '@tim-mhn/common/icons';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  TableColumns,
  TableData,
} from '../../../../../shared/components/table/models/table';
import { ProjectMembers } from '../../../../core/models';
import { ProjectMemberTableItem } from './models/project-member-table-item';
import { filterMembersByNameOrEmail } from './utils/filter-members-by-search.util';

@Component({
  selector: 'jira-project-members-list',
  templateUrl: './project-members-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMembersListComponent implements OnInit {
  readonly SEARCH_ICON = ICONS.SEARCH;

  @Input() set members(members: ProjectMembers) {
    this.allMembers = members;
    this._setTableData(members);
  }

  @Input() loading: boolean;

  allMembers: ProjectMembers;

  private _setTableData(members: ProjectMembers) {
    const tableData = members?.map((member) => ({
      ...member,
      icon: member,
    }));
    this.tableData$.next(tableData);
  }

  tableData$ = new Subject<TableData<ProjectMemberTableItem>>();

  searchMembersByNameCtrl = new FormControl('');
  @ViewChild('memberIcon', { static: true })
  memberIconTemplate: TemplateRef<any>;

  @ViewChild('joinedDate', { static: true })
  joinedDateTemplate: TemplateRef<any>;

  TABLE_COLUMNS: TableColumns<ProjectMemberTableItem> = [];
  constructor(private cdr: ChangeDetectorRef) {}

  tableData: ProjectMemberTableItem[] = [];

  ngOnInit(): void {
    this._setTableColumns();
    this._filterMembersOnInputChanges();
  }

  private _filterMembersOnInputChanges() {
    this.searchMembersByNameCtrl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((text) => {
        const filteredMembers = filterMembersByNameOrEmail(
          this.allMembers,
          text
        );

        this._setTableData(filteredMembers);

        this.cdr.detectChanges();
      });
  }

  private _setTableColumns() {
    this.TABLE_COLUMNS = [
      {
        key: 'icon',
        label: '',
        template: this.memberIconTemplate,
      },
      {
        key: 'Name',
        label: 'Name',
      },
      {
        key: 'Email',
        label: 'Email',
      },
      {
        key: 'JoinedOn',
        label: 'Joined on',
        template: this.joinedDateTemplate,
      },
    ];
  }
}
