import { Component, OnInit } from '@angular/core';
import { ProjectListAPI } from '../../../core/apis/project-list.api';
import { ProjectIdNames } from '../../../core/models/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  constructor(private api: ProjectListAPI) {}

  projectList: ProjectIdNames = [];
  ngOnInit(): void {
    this.api
      .getUserProjects()
      .subscribe((projects) => (this.projectList = projects));
  }
}
