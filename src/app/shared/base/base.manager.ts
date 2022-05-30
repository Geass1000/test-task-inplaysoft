import type { Subscription } from 'rxjs';

import { SubscriptionManager } from './subscription.manager';
import { ShouldUpdateManager } from './should-update.manager';
import { LocalStorageService } from './local-storage.service';

export class BaseManager {
  protected localStorageService: LocalStorageService;
  protected subscriptionManager: SubscriptionManager;
  protected shouldUpdateManager: ShouldUpdateManager;

  constructor (
  ) {
    this.localStorageService = new LocalStorageService();
    this.subscriptionManager = new SubscriptionManager();
    this.shouldUpdateManager = new ShouldUpdateManager();
    this.subscriptionManager.registerManager(this.shouldUpdateManager);
  }

  /**
   * Destroys all RxJs subscriptions.
   *
   * @return {void}
   */
  $destroy (
  ): void {
    this.subscriptionManager.$destroy();
  }

  /**
   * Adds a subscription to subsciption list.
   *
   * @param  {Subscription} sub
   * @return {void}
   */
  protected subscribe (
    subscription: Subscription,
  ): void {
    this.subscriptionManager.subscribe(subscription);
  }

  /**
   * Adds the manager to the list of managers.
   * Method `$destroy` of every manager will be called in `$destory` hook of `Subscription` manager.
   *
   * @param  {any} manager
   * @return {void}
   */
  protected registerManager (
    manager: any,
  ): void {
    this.subscriptionManager.registerManager(manager);
  }

  /**
   * Returns `true` if we allow to update the logic for this label (non-recursive comparison).
   *
   * @param  {string} label
   * @param  {any[]} params
   * @return {boolean}
   */
  protected shouldUpdate (
    label: string,
    params: any[],
  ): boolean {
    return this.shouldUpdateManager.shouldUpdate(label, params);
  }

  /**
   * Resets the `should update` logic by key.
   *
   * @param  {string} key
   * @return {void}
   */
  protected resetKey (
    key: string,
  ): void {
    this.shouldUpdateManager.resetKey(key);
  }

  /**
   * Creates stop-promise which will be resolved in the specific interval.
   *
   * @param  {number} waitFor
   * @return {Promise<void>}
   */
  protected async waitTimer (
    waitFor: number,
  ): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, waitFor || 0);
    });
  }

  /**
   * Returns random integer.
   *
   * @param  {number} min
   * @param  {number} max
   * @return {number}
   */
  protected getRandomInt (
    min: number,
    max: number,
  ): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
