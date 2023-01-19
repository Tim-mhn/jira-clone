import { Component, Input, OnInit } from '@angular/core';
import { ChipColor } from '@tim-mhn/ng-ui/chip';
import { SprintPointsBreakdown } from '../../../../../core/models/sprint';

@Component({
  selector: 'jira-sprint-points-breakdown',
  templateUrl: './sprint-points-breakdown.component.html',
})
export class SprintPointsBreakdownComponent implements OnInit {
  @Input() points: SprintPointsBreakdown;

  constructor() {}

  readonly CHIP_TOOLTIP_OPTS: {
    chipColor: ChipColor;
    pointsKey: keyof SprintPointsBreakdown;
    tooltipLabel: string;
  }[] = [
    {
      chipColor: 'neutral-darker',
      pointsKey: 'New',
      tooltipLabel: 'Not started',
    },
    {
      chipColor: 'primary-darker',
      pointsKey: 'InProgress',
      tooltipLabel: 'In progress',
    },
    {
      chipColor: 'success-darker',
      pointsKey: 'Done',
      tooltipLabel: 'Done',
    },
  ];

  ngOnInit(): void {}
}
