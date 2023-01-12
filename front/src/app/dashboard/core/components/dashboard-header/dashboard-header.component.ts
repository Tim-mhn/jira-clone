import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAPI } from '../../../../auth/apis/auth.api';
import { LoggedInUserService } from '../../../services/logged-in-user.service';

@Component({
  selector: 'jira-dashboard-header',
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent implements OnInit {
  constructor(
    private loggedUserService: LoggedInUserService,
    private authController: AuthAPI,
    private router: Router
  ) {}

  loggedUser$ = this.loggedUserService.user$;
  ngOnInit(): void {}

  signOut() {
    this.authController
      .signOut()
      .subscribe(() => this.router.navigate(['/auth/login']));
  }
}
