import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jira-logo',
  templateUrl: './logo.component.html',
  host: {
    class: 'w-fit',
  },
})
export class JiraLogoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
