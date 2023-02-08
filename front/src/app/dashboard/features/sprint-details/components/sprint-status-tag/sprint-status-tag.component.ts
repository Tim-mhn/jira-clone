import { Component, Input, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';
import { SprintInfo } from '../../../../core/models';

@Component({
  selector: 'jira-sprint-status-tag',
  templateUrl: './sprint-status-tag.component.html',
})
export class SprintStatusTagComponent implements OnInit {
  @Input() sprint: SprintInfo;
  readonly CHECK_ICON = ICONS.CHECK_WHITE;

  constructor() {}

  ngOnInit(): void {}
}
