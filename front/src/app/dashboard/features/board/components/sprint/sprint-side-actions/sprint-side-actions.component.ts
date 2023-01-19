import { Component, Input, OnInit } from '@angular/core';
import { SprintInfo } from '../../../../../core/models/sprint';

@Component({
  selector: 'jira-sprint-side-actions',
  templateUrl: './sprint-side-actions.component.html',
})
export class SprintSideActionsComponent implements OnInit {
  @Input() sprint: SprintInfo;
  constructor() {}

  ngOnInit(): void {}
}
