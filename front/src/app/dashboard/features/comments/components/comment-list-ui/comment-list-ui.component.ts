import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TaskComments } from '../../models';

@Component({
  selector: 'jira-comment-list-ui',
  templateUrl: './comment-list-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListUiComponent implements OnInit {
  @Input() comments: TaskComments;

  constructor() {}

  ngOnInit(): void {}
}
