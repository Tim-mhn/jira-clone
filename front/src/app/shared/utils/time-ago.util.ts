/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
const TIME_PERIODS = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
] as const;

type TimePeriod = typeof TIME_PERIODS[number];

const getTimePeriodFunctions: {
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
  if (lessThan1SecondOfDifference(time, _currentTime)) return 'Just now';

  const unequalTimePeriod = getUnequalTimePeriod(time, _currentTime);

  const getTimePeriod = getTimePeriodFunctions[unequalTimePeriod];

  const periodDifference = getTimePeriod(_currentTime) - getTimePeriod(time);

  const periodLabel = pluralize(periodDifference, unequalTimePeriod);
  return `${periodDifference} ${periodLabel} ago`;
}

function lessThan1SecondOfDifference(date1: Date, date2: Date) {
  const ONE_SECOND_IN_MS = 1000;
  return Math.abs(date1.getTime() - date2.getTime()) < ONE_SECOND_IN_MS;
}

function getUnequalTimePeriod(time1: Date, time2: Date) {
  return TIME_PERIODS.find((period) => {
    const getTimePeriod = getTimePeriodFunctions[period];
    const periodDifference = getTimePeriod(time2) - getTimePeriod(time1);
    return periodDifference !== 0;
  });
}

function pluralize(count: number, word: string) {
  return count > 1 ? `${word}s` : word;
}
