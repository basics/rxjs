import { concatWith, map, of, Subject } from 'rxjs';

import { calcReceivedStats, MSECOND } from './utils';

export const EstimateTime = (timeUnit = MSECOND) => {
  return new Subject().pipe(
    calcReceivedStats(),
    calcEstimatedTime(),
    concatWith(of(0)),
    convertEstimedTimeTo(timeUnit)
  );
};

const calcEstimatedTime = () => {
  return source =>
    source.pipe(map(({ value, total, period }) => Math.ceil((total - value) * (period / value))));
};

const convertEstimedTimeTo = timeRatio => {
  return source => source.pipe(map(value => value / timeRatio));
};
