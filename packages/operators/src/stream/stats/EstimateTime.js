import { concatWith, distinctUntilChanged, map, of, Subject } from 'rxjs';

import { calcReceivedStats, MSECOND } from './utils';

export default {
  create: (timeUnit = MSECOND) => {
    return new Subject().pipe(
      calcReceivedStats(),
      calcEstimatedTime(),
      concatWith(of(0)),
      distinctUntilChanged(),
      convertEstimedTimeTo(timeUnit)
    );
  }
};

const calcEstimatedTime = () => {
  return source =>
    source.pipe(map(({ value, total, period }) => Math.ceil((total - value) * (period / value))));
};

const convertEstimedTimeTo = timeRatio => {
  return source => source.pipe(map(value => value / timeRatio));
};
