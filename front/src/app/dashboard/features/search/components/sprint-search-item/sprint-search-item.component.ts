import { Component, Input, OnInit } from '@angular/core';
import { buildSprintPageRoute } from '../../../browse/utils/build-browse-page-routes.util';
import { SearchSprintDTO } from '../../dtos/search-task.dto';

@Component({
  selector: 'jira-sprint-search-item',
  templateUrl: './sprint-search-item.component.html',
})
export class SprintSearchItemComponent implements OnInit {
  @Input() sprintInfo: SearchSprintDTO;
  constructor() {}

  sprintPageRoute: string[];
  ngOnChanges() {
    if (!this.sprintInfo) return;
    this.sprintPageRoute = buildSprintPageRoute(
      this.sprintInfo,
      this.sprintInfo?.Project
    );
  }
  ngOnInit(): void {}
}
