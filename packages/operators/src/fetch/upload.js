import { concatMap, of } from 'rxjs';

import { request } from './request';

export const upload = () => {
  return source => source.pipe(request());
};
