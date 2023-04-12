import { Component, OnInit } from '@angular/core';
import { AuthController } from '../../../auth/controllers/auth.controller';
import { LoggedInUserService } from '../../../dashboard/core/state-services/logged-in-user.service';

@Component({
  selector: 'jira-home-page',
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  constructor(
    private authController: AuthController,
    private loggedInUserService: LoggedInUserService
  ) {}

  loggedIn$ = this.loggedInUserService.isLoggedIn$;

  ngOnInit(): void {
    this.authController.fetchAndUpdateCurrentUser().subscribe();
  }
}
