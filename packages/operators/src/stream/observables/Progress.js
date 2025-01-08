import { concatWith, distinctUntilChanged, map, of, Subject } from 'rxjs';

import { calcReceivedStats } from './utils';

export const Progress = () => {
  return new Subject().pipe(
    calcReceivedStats(),
    calcPercentageProgress(),
    concatWith(of(100)),
    distinctUntilChanged()
  );
};

const calcPercentageProgress = () => {
  return source => source.pipe(map(({ value, total }) => Math.floor((value / total) * 100)));
};
