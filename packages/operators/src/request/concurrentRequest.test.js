import { concatAll, concatMap, delay, from, map, of, tap, toArray } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { log } from '../log';
import { resolveJSON } from './response';

describe('concurrent request - mocked', function () {
  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).to.eql(expected);
  });

  const getTriggerValues = () => ({
    a: { t: 2, v: 'a' },
    b: { t: 5, v: 'b' },
    c: { t: 1, v: 'c' },
    d: { t: 3, v: 'd' },
    e: { t: 4, v: 'e' }
  });

  beforeEach(function () {
    vi.doMock('./request', importOriginal => ({
      request: () => source => source.pipe(concatMap(({ v, t }) => of(v).pipe(delay(t))))
    }));
  });

  afterEach(() => {
    vi.doUnmock('./request');
  });

  test('classic testing', async () => {
    const { concurrentRequest } = await import('./concurrentRequest');

    const triggerVal = Object.values(getTriggerValues());
    const sortedVal = [...triggerVal].sort((a, b) => a.t - b.t).map(({ v }) => v);

    await new Promise((done, error) => {
      from(triggerVal)
        .pipe(concurrentRequest(triggerVal.length), toArray())
        .subscribe({
          next: e => expect(e).toStrictEqual(sortedVal),
          complete: () => done(),
          error: e => error(e)
        });
    });
  });

  test('marble testing', async () => {
    const { concurrentRequest } = await import('./concurrentRequest');

    const triggerVal = getTriggerValues();
    const expectedVal = Object.fromEntries(Object.entries(triggerVal).map(([k, { v }]) => [k, v]));

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(
        cold('-a-b-(cd)-e----', triggerVal).pipe(concurrentRequest(Object.keys(triggerVal).length))
      ).toBe('---a--c-(bd)--e', expectedVal);
    });
  });
});

describe.skip('concurrent request - demo', function () {
  beforeAll(function () {
    vi.resetModules();
  });

  test('sample testing', async () => {
    const { concurrentRequest } = await import('./concurrentRequest');

    await new Promise(done => {
      of(
        new URL('https://dummyjson.com/products?limit=10&skip=0&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=10&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=20&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=30&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=40&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=50&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=60&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=70&select=title,price'),
        new URL('https://dummyjson.com/products?limit=10&skip=80&select=title,price')
      )
        .pipe(
          concurrentRequest(4),
          log(false),
          resolveJSON(),
          log(false),
          map(({ products }) => products),
          concatAll()
        )
        .subscribe({
          next: e => console.log(e),
          complete: () => done()
        });
    });
  });
});