import { Component, Input, OnInit } from '@angular/core';
import { ProjectIdName } from '../../../../core/models';

@Component({
  selector: 'jira-search-result-item-ui',
  templateUrl: './search-result-item-ui.component.html',
})
export class SearchResultItemUiComponent implements OnInit {
  @Input() project: ProjectIdName;
  constructor() {}

  ngOnInit(): void {}
}
