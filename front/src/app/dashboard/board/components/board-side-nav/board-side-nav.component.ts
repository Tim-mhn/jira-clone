import { Component, OnInit } from '@angular/core';
import { CurrentProjectService } from '../../state-services/current-project.service';

@Component({
  selector: 'jira-board-side-nav',
  templateUrl: './board-side-nav.component.html',
})
export class BoardSideNavComponent implements OnInit {
  constructor(private currentProjectService: CurrentProjectService) {}

  currentProject$ = this.currentProjectService.currentProject$;
  ngOnInit(): void {}
}
