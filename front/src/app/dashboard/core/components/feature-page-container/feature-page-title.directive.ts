import { Directive } from '@angular/core';

@Directive({
  selector: 'feature-page-title',
  host: {
    class: 'text-3xl font-medium text-gray-800 mb-2',
  },
})
export class FeaturePageTitleDirective {
  constructor() {}
}
