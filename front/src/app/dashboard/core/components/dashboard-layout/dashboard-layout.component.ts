import { Component, OnInit } from '@angular/core';
import { AuthController } from '../../../../auth/controllers/auth.controller';

@Component({
  selector: 'jira-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  constructor(private controller: AuthController) {}

  ngOnInit(): void {
    this.controller.fetchCurrentUserOrGoBackToLogin().subscribe();
  }
}
