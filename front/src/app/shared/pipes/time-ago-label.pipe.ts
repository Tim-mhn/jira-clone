import { Pipe, PipeTransform } from '@angular/core';
import { timeAgoLabel } from '../utils/time-ago.util';

@Pipe({
  name: 'timeAgoLabel',
})
export class TimeAgoLabelPipe implements PipeTransform {
  transform(date: Date, _recompute?: any): string {
    return timeAgoLabel(date);
  }
}
