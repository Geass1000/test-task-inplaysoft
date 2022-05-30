import type { LoDashStatic } from 'lodash';

import * as _ from 'lodash';

const lodash = {
} as LoDashStatic;

(window as any)._ = _;

declare global {
  const _: typeof lodash;
  const pageStartedAt: Date;
}
