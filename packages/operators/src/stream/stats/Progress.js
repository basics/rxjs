import { concatWith, distinctUntilChanged, map, of, Subject } from 'rxjs';

import { calcReceivedStats } from './utils';

export class Progress extends Subject {
  constructor() {
    super();
    return this.pipe(
      calcReceivedStats(),
      calcPercentageProgress(),
      concatWith(of(100)),
      distinctUntilChanged()
    );
  }
}

const calcPercentageProgress = () => {
  return source => source.pipe(map(({ value, total }) => Math.floor((value / total) * 100)));
};
