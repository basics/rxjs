import { concatMap, from, throwError } from 'rxjs';

import { cache } from './cache';
import { resolveBlob, resolveJSON, resolveText } from './response';
import { retryWhenRequestError } from './retry';
import { bypassStream } from './stream/bypassStream';

export const request = ({ retry, cache: cacheOptions, download = [], upload = [] } = {}) => {
  return source =>
    source.pipe(
      bypassStream(upload),
      tryRequest(),
      retryWhenRequestError(retry),
      bypassStream(download),
      cache(cacheOptions)
      //
    );
};

const tryRequest = () => source =>
  source.pipe(
    concatMap(req => {
      try {
        return from(fetch(req));
      } catch {
        return throwError(() => new Error('Failed to fetch: resource not valid'));
      }
    })
  );

export const requestJSON = options => {
  return source => source.pipe(request(options), resolveJSON());
};

export const requestText = options => {
  return source => source.pipe(request(options), resolveText());
};

export const requestBlob = options => {
  return source => source.pipe(request(options), resolveBlob());
};
