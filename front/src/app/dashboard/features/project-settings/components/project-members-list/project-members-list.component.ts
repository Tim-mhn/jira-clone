import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TableColumns } from '../../../../../shared/components/table/models/table';
import { ProjectMembers } from '../../../../core/models';
import { ProjectMemberTableItem } from './models/project-member-table-item';

@Component({
  selector: 'jira-project-members-list',
  templateUrl: './project-members-list.component.html',
})
export class ProjectMembersListComponent implements OnInit {
  @Input() set members(members: ProjectMembers) {
    this.tableData = members?.map((member) => ({
      ...member,
      icon: member,
    }));
  }

  @ViewChild('memberIcon', { static: true })
  memberIconTemplate: TemplateRef<any>;

  @ViewChild('joinedDate', { static: true })
  joinedDateTemplate: TemplateRef<any>;

  TABLE_COLUMNS: TableColumns<ProjectMemberTableItem> = [];
  constructor() {}

  tableData: ProjectMemberTableItem[] = [];

  ngOnInit(): void {
    this._setTableColumns();
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
