import { Component, OnInit } from '@angular/core';
import { ProjectListAPI } from '../../core/apis/project-list.api';
import { Projects } from '../../models/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  constructor(private api: ProjectListAPI) {}

  projectList: Projects = [];
  ngOnInit(): void {
    this.api
      .getUserProjects()
      .subscribe((projects) => (this.projectList = projects));
  }
}
