import { Injectable } from '@angular/core';

// Stores
import { StateStore } from '@core/state-store';
import { Interfaces, Enums } from './shared';

const initialStore: Interfaces.CurrencyStore = {
  currencyUpdateInterval: 15,
  currencyChangeDirectionTimeout: 10,
};

@Injectable()
export class CurrencyAction {
  constructor (
    // SS
    private stateStore: StateStore,
  ) {
    this.initStore();
  }

  /**
   * Sets the new currency update interval.
   *
   * @param  {number} currencyUpdateInterval
   * @return {void}
   */
  setCurrencyUpdateInterval (
    currencyUpdateInterval: number,
  ): void {
    this.stateStore.setState({
      state: Enums.State.CurrencyUpdateInterval,
      value: currencyUpdateInterval,
    });
  }

  /**
   * Sets the new currency change direction timeout.
   *
   * @param  {number} currencyChangeDirectionTimeout
   * @return {void}
   */
  setCurrencyChangeDirectionTimeout (
    currencyChangeDirectionTimeout: number,
  ): void {
    this.stateStore.setState({
      state: Enums.State.CurrencyChangeDirectionTimeout,
      value: currencyChangeDirectionTimeout,
    });
  }

  /**
   * Initializes `Currency` store.
   *
   * @return {void}
   */
  initStore (): void {
    const currentStore = this.stateStore.getState([ Enums.StateStoreName ]);
    const updatedStore = _.assign({}, currentStore, initialStore);

    this.stateStore.setState({
      state: [ Enums.StateStoreName ],
      value: updatedStore,
    });
  }
}
