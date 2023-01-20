import { Component, Input, OnInit } from '@angular/core';
import { BreadcrumbParts, Breadcrumbs } from './breadcrumbs';

@Component({
  selector: 'jira-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit {
  @Input('breadcrumbs') set _breadcrumbs(bs: BreadcrumbParts) {
    this.breadcrumbs = breadcrumbsWithConcatenatedRoutes(bs);
  }

  breadcrumbs: Breadcrumbs;
  constructor() {}

  ngOnInit(): void {}
}

export function breadcrumbsWithConcatenatedRoutes(
  bs: BreadcrumbParts
): Breadcrumbs {
  const breadcrumbs: Breadcrumbs = [];
  bs?.forEach((b, index) => {
    const { label } = b;
    const fullRoutes = bs
      .filter((_, idx) => idx <= index)
      .reduce(
        (tmpRoute, lastPart) => [...tmpRoute, <string>(<any>lastPart.route)],
        ['/']
      );
    breadcrumbs.push({ label, route: fullRoutes });
  });

  return breadcrumbs;
}
