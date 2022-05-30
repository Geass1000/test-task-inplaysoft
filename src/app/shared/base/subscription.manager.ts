import type { Subscription } from 'rxjs';

export class SubscriptionManager {
  private subscriptionsSet: Set<Subscription>;
  private managersSet: Set<any>;

  constructor (
  ) {
    this.subscriptionsSet = new Set();
    this.managersSet = new Set();
  }

  /**
   * Destroys all RxJs subscriptions and managers.
   *
   * @return {void}
   */
  $destroy (): void {
    this.subscriptionsSet.forEach((subscription) => {
      if (typeof subscription?.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    });
    this.subscriptionsSet.clear();

    this.managersSet.forEach((manager) => {
      if (typeof manager?.$destroy === 'function') {
        manager.$destroy();
      }
    });
    this.managersSet.clear();
  }

  /**
   * Adds a subscription to subsciption list.
   *
   * @param  {Subscription} sub
   * @return {void}
   */
  subscribe (
    sub: Subscription,
  ): void {
    this.subscriptionsSet.add(sub);
  }

  /**
   * Adds the manager to the list of managers.
   * Method `$destroy` of every manager will be called in `$destory` hook of `Subscription` manager.
   *
   * @param  {any} manager
   * @return {void}
   */
  registerManager (
    manager: any,
  ): void {
    this.managersSet.add(manager);
  }
}
