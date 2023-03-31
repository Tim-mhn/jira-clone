import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jira-not-found',
  templateUrl: './not-found.page.html',
})
export class NotFoundPage implements OnInit {
  readonly ASTRONAUT_IMG = 'assets/page-not-found/astronaut.png';
  readonly MOON_IMG = 'assets/page-not-found/full-moon.png';

  constructor() {}

  ngOnInit(): void {}
}
