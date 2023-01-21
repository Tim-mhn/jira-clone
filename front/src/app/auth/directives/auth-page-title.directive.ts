import { Directive } from '@angular/core';

@Directive({
  selector: '[jiraAuthPageTitle]',
  host: {
    class: 'text-xl text-gray-700 text-center',
  },
})
export class AuthPageTitleDirective {
  constructor() {}
}
