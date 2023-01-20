import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jira-side-nav-item',
  templateUrl: './side-nav-item.component.html',
  host: {
    class: 'w-full ',
  },
})
export class SideNavItemComponent implements OnInit {
  @Input() link: string[];
  constructor() {}

  ngOnInit(): void {}
}
