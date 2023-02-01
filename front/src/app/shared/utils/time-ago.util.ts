const TIME_PERIODS = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
] as const;

type TimePeriod = typeof TIME_PERIODS[number];

const timePeriodToFn: {
  [period in TimePeriod]: (d: Date) => number;
} = {
  second: (d: Date) => d.getSeconds(),
  minute: (d: Date) => d.getMinutes(),
  hour: (d: Date) => d.getHours(),
  day: (d: Date) => d.getDate(),
  month: (d: Date) => d.getMonth(),
  year: (d: Date) => d.getFullYear(),
};

export function timeAgoLabel(time: Date, _currentTime = new Date(Date.now())) {
  // eslint-disable-next-line no-restricted-syntax
  for (const period of TIME_PERIODS) {
    const getValueOfPeriodFn = timePeriodToFn[period];
    const periodDifference =
      getValueOfPeriodFn(_currentTime) - getValueOfPeriodFn(time);

    const timePeriodsAreDifferent = periodDifference !== 0;
    if (timePeriodsAreDifferent) {
      const periodLabel = pluralize(periodDifference, period);
      return `${periodDifference} ${periodLabel} ago`;
    }
  }

  return '';
}

function pluralize(count: number, word: string) {
  return count > 1 ? `${word}s` : word;
}
