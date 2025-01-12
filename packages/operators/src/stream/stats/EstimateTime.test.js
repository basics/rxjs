import { tap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, test } from 'vitest';

import EstimateTime from './EstimateTime';
import { SECOND } from './utils';

describe('EstimateTime', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).deep.equal(expected));
  });

  test('calc estimate time - millisecond', async () => {
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
      a: 8,
      b: 7,
      c: 6,
      d: 5,
      e: 4,
      f: 3,
      g: 2,
      h: 1,
      i: 0
    };

    const estimateTime = EstimateTime.create();

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(estimateTime).toBe('a-b-c-d-e-f-g-h-i', expectedVal);
      expectObservable(
        cold('a-b-c-d-e-f-g-h-i|', triggerVal).pipe(tap(val => estimateTime.next(val)))
      );
    });
  });

  test('calc estimate time - second', async () => {
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
      a: 0.008,
      b: 0.007,
      c: 0.006,
      d: 0.005,
      e: 0.004,
      f: 0.003,
      g: 0.002,
      h: 0.001,
      i: 0
    };

    const estimateTimeSecond = EstimateTime.create(SECOND);

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(estimateTimeSecond).toBe('a-b-c-d-e-f-g-h-i', expectedVal);
      expectObservable(
        cold('a-b-c-d-e-f-g-h-i|', triggerVal).pipe(tap(val => estimateTimeSecond.next(val)))
      );
    });
  });
});
