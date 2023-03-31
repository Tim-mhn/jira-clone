import { Component, OnInit } from '@angular/core';
import { ICONS } from '@tim-mhn/common/icons';

@Component({
  selector: 'jira-not-found',
  templateUrl: './not-found.page.html',
})
export class NotFoundPage implements OnInit {
  readonly ASTRONAUT_IMG = ICONS.ASTRONAUT;
  readonly MOON_IMG = ICONS.MOON;

  constructor() {}

  ngOnInit(): void {}
}
