import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbParts } from '../../../../shared/components/breadcrumb/breadcrumbs';

@Component({
  selector: 'jira-feature-page-container',
  templateUrl: './feature-page-container.component.html',
})
export class FeaturePageContainerComponent implements OnInit {
  @Input() breadcrumbs: BreadcrumbParts;
  constructor() {}

  ngOnInit(): void {}
}
