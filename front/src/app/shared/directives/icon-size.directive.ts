import { Directive } from '@angular/core';

@Directive({
  selector: 'img[iconSize]',
  host: {
    width: '20',
    height: '20',
    class: 'h-5 w-5',
  },
})
export class JiraIconSize {}
