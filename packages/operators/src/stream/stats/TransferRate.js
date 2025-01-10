import { map, Subject } from 'rxjs';

import { calcReceivedStats, MBIT, SECOND } from './utils';

export class TransferRate extends Subject {
  constructor(byteUnit = MBIT, timeUnit = SECOND) {
    super();
    return this.pipe(
      calcReceivedStats(),
      calcAverageByteLengthPerTimeUnit(timeUnit),
      calcTransferRate(byteUnit)
    );
  }
}

const calcAverageByteLengthPerTimeUnit = timeRatio => {
  return source => source.pipe(map(({ value, period }) => (value / period) * timeRatio));
};

const calcTransferRate = byteRatio => {
  return source => source.pipe(map(bytes => bytes * byteRatio));
};
