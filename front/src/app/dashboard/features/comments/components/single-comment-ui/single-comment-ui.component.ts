import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TaskComment } from '../../models/comment';

@Component({
  selector: 'jira-single-comment-ui',
  templateUrl: './single-comment-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleCommentUiComponent implements OnInit {
  @Input() comment: TaskComment;
  constructor() {}

  ngOnInit(): void {}
}
