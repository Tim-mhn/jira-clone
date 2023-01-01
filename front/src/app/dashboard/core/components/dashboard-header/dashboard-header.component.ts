import { Component, OnInit } from '@angular/core';
import { LoggedInUserService } from '../../../services/logged-in-user.service';

@Component({
  selector: 'jira-dashboard-header',
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent implements OnInit {
  constructor(private loggedUserService: LoggedInUserService) {}

  loggedUser$ = this.loggedUserService.user$;
  ngOnInit(): void {}
}
