import { tap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, test } from 'vitest';

import TransferRate from './TransferRate';
import { KBIT } from './utils';

describe('TransferRate', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).deep.equal(expected));
  });

  test('calc transfer rate', async () => {
    const triggerVal = {
      a: { value: new TextEncoder().encode('abc'), total: 26, period: 1 },
      b: { value: new TextEncoder().encode('def'), total: 26, period: 2 },
      c: { value: new TextEncoder().encode('ghi'), total: 26, period: 3 },
      d: { value: new TextEncoder().encode('jkl'), total: 26, period: 4 },
      e: { value: new TextEncoder().encode('mno'), total: 26, period: 5 },
      f: { value: new TextEncoder().encode('pqr'), total: 26, period: 6 },
      g: { value: new TextEncoder().encode('stu'), total: 26, period: 7 },
      h: { value: new TextEncoder().encode('vwx'), total: 26, period: 8 },
      i: { value: new TextEncoder().encode('yz'), total: 26, period: 9 }
    };

    const expectedVal = {
      a: 23.4375,
      b: 23.4375,
      c: 23.4375,
      d: 23.4375,
      e: 23.4375,
      f: 23.4375,
      g: 23.4375,
      h: 23.4375,
      i: 22.569444444444443
    };

    const transferRate = TransferRate.create(KBIT);

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(transferRate).toBe('a-b-c-d-e-f-g-h-i', expectedVal);
      expectObservable(
        cold('a-b-c-d-e-f-g-h-i', triggerVal).pipe(tap(val => transferRate.next(val)))
      );
    });
  });
});
