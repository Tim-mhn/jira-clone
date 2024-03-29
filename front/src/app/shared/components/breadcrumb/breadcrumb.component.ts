import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BreadcrumbParts, Breadcrumbs } from './breadcrumbs';

@Component({
  selector: 'jira-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  const partsWithoutNullRoutes = bs?.filter((b) => !!b.route);
  partsWithoutNullRoutes
    ?.filter((b) => !!b.route)
    .forEach((b, index) => {
      const { label } = b;
      const fullRoutes = partsWithoutNullRoutes
        .filter((_, idx) => idx <= index)
        .reduce(
          (tmpRoute, lastPart) => {
            if (typeof lastPart.route === 'string') {
              return [...tmpRoute, lastPart.route];
            }
            return [...tmpRoute, ...lastPart.route];
          },
          ['/']
        );
      breadcrumbs.push({ label, route: fullRoutes });
    });

  return breadcrumbs;
}
