import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { SingleProjectAPI } from '../../apis/single-project.api';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private route: ActivatedRoute, private api: SingleProjectAPI) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params['projectId']),
        filter((projectId) => !!projectId),
        switchMap((projectId) => this.api.getProjectInfo(projectId))
      )
      .subscribe((projectInfo) => {
        console.log(projectInfo);
      });
  }
}
