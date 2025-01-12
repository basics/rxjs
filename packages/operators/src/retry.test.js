import { map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { log } from './log';
import { retryWhenRequestError } from './retry';

describe('request retry', () => {
  let testScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).deep.equal(expected));
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('2x error -> 1x success', () => {
    const expectedVal = {
      a: new Response('', { status: 500 }),
      b: new Response('', { status: 500 }),
      c: new Response('a', { status: 200 })
    };

    const triggerVal = [expectedVal.a, expectedVal.b, expectedVal.c];

    testScheduler.run(({ cold, expectObservable }) => {
      // retry is repeating the sequence
      // if you define a delay, you have to add the delay to the subscribe multiple times (num retries)
      const stream = cold('a|', { a: () => triggerVal.shift() }).pipe(
        map(fn => fn()),
        log('operators:retry:default:input'),
        retryWhenRequestError({ retryableStatuses: [500], timeout: () => 5 }),
        log('operators:retry:default:output')
      );

      const unsubA = '^-----------';
      expectObservable(stream, unsubA).toBe('----------c|', expectedVal);
    });
  });
});
