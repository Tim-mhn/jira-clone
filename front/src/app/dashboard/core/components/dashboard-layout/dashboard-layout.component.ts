import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAPI } from '../../../../auth/apis/auth.api';
import { LoggedInUserService } from '../../../services/logged-in-user.service';

@Component({
  selector: 'jira-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  providers: [AuthAPI],
})
export class DashboardLayoutComponent implements OnInit {
  constructor(
    private authAPI: AuthAPI,
    private loggedInUserService: LoggedInUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authAPI.me().subscribe({
      next: (u) => this.loggedInUserService.setLoggedInUser(u),
      error: () => this.router.navigate(['/auth', 'login']),
    });
  }
}
