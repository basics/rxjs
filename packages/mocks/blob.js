import { vi } from 'vitest';

import { mockAsync } from './async';

export const mockBlob = () => {
  return vi.fn(([e], type) => ({
    text: () => {
      console.log(type);
      return mockAsync(new TextDecoder().decode(e));
    },
    type: e.type
  }));
};
