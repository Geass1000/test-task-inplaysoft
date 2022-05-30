import { OnDestroy, Directive } from '@angular/core';
import { BaseManager } from './base.manager';

@Directive()
export class BaseDirective extends BaseManager implements OnDestroy {

  constructor (
  ) {
    super();
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  ngOnDestroy (
  ): void {
    this.$destroy();
  }
}
