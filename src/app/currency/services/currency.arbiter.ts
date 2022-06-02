import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BaseManager } from '../../shared';

// Services
import { CurrencyService } from './currency.service';
import { CurrencyHistoryArbiter } from './currency-history.arbiter';

// SS
import { StateStore } from '@core/state-store';

// RS
import { CurrencyRateRS } from '../resources/currency-rate.rs';

import { Enums } from '../shared';

@Injectable()
export class CurrencyArbiter extends BaseManager {
  /**
   * Instance of Timer.
   * Loads the list of currency rates and saves them.
   */
  public currencyUpdateIntervalTimer: number;
  /**
   * Instance of Timer.
   * Marks all updated currency states as non-changed.
   */
  public currencyDirectionTimeoutTimer: number;

  public sjNotif: Subject<number> = new Subject();

  constructor (
    // Service
    private currencyService: CurrencyService,
    private currencyHistoryArbiter: CurrencyHistoryArbiter,
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
    private stateStore: StateStore,
  ) {
    super();
  }

  /**
   * Returns notification observable.
   *
   * @return {Observable<number>}
   */
  getObserver (): Observable<number> {
    return this.sjNotif.asObservable();
  }

  /**
   * Inits the arbiter:
   *  - loads the first set of rates.
   *  - starts `Currency Update Interval` timer using stored in local store value.
   *
   * @return {Promise<void>}
   */
  async $init (): Promise<void> {
    await this.updateCurrencyRates();

    const currencyUpdateInterval = this.stateStore.getState<number>(Enums.State.CurrencyUpdateInterval);
    this.startCurrencyUpdateInterval(currencyUpdateInterval);
    this.startCurrencyDirectionTimeout();
  }

  /**
   * Destroys the arbiter:
   *  - stops `Currency Update Interval` timer;
   *
   * @return {void}
   */
  $destroy (): void {
    this.stopCurrencyUpdateInterval();
  }

  /**
   * Starts `Currency Update Interval` timer.
   *
   * FYI: This timer loads the set of currency rates w/ some period. Loaded currency rates
   * replace the current currency rates. Old currency rates are saved in the history arbiter.
   *
   * @param  {number} currencyUpdateIntervalSec - seconds unit
   * @return {void}
   */
  startCurrencyUpdateInterval (
    currencyUpdateIntervalSec: number,
  ): void {
    if (_.isNumber(currencyUpdateIntervalSec) === false) {
      throw new Error(`CurrencyArbiter.startCurrencyUpdateInterval:`
        + `'currencyUpdateInterval' should be a number`);
    }
    if (_.isNumber(currencyUpdateIntervalSec) === false || currencyUpdateIntervalSec < 0) {
      throw new Error(`CurrencyArbiter.startCurrencyUpdateInterval:`
        + `'currencyUpdateInterval' should be more than 0`);
    }

    this.stopCurrencyUpdateInterval();

    this.stopCurrencyDirectionTimeout();
    this.resetCurrencyUpdateStates();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.currencyUpdateIntervalTimer = setTimeout(async () => {
      await this.updateCurrencyRates();
      this.currencyUpdateIntervalTimer = null;

      // FYI: Next iteration. We don't use interval timer bz we want to start next iteration only after we get a
      // current currency rates. Macrotask level interval.
      this.startCurrencyUpdateInterval(currencyUpdateIntervalSec);
      this.startCurrencyDirectionTimeout();
    }, currencyUpdateIntervalSec * 1000) as any as number;
  }

  /**
   * Stops `Currency Update Interval` timer.
   *
   * @return {void}
   */
  stopCurrencyUpdateInterval (): void {
    if (_.isNil(this.currencyUpdateIntervalTimer) === true) {
      return;
    }

    clearTimeout(this.currencyUpdateIntervalTimer);
    this.currencyUpdateIntervalTimer = null;
  }

  /**
   * Loads the new currency rates and saves them in resource store. Prev ones are saved in the history arbiter.
   *
   * @return {Promise<void>}
   */
  private async updateCurrencyRates (): Promise<void> {
    try {
      const currencyRates = await this.currencyService.loadCurrentCurrencyRates();
      this.currencyHistoryArbiter.updateCurrencyRates(currencyRates);
      this.sjNotif.next();
    } catch (error) {
      console.error(`CurrencyArbiter.startCurrencyUpdateInterval: Can't load currency rates. Error:`, error);
    }
  }

  /**
   * Starts `Currency Direction Timeout` timer.
   *
   * FYI: This timer clears `Update` status of all currency rates in the `Currency Direction Timeout` time.
   * If this timer delay is equal to or more than `Update Interval` delay, timer won't start.
   *
   * @return {void}
   */
  startCurrencyDirectionTimeout (): void {
    const currencyUpdateInterval = this.stateStore.getState<number>(Enums.State.CurrencyUpdateInterval);
    const currencyChangeDirectionTimeout = this.stateStore.getState<number>(Enums.State.CurrencyChangeDirectionTimeout);

    if (currencyChangeDirectionTimeout >= currencyUpdateInterval) {
      return;
    }

    this.stopCurrencyDirectionTimeout();

    this.currencyDirectionTimeoutTimer = setTimeout(() => {
      this.resetCurrencyUpdateStates();
      this.currencyDirectionTimeoutTimer = null;
    }, currencyChangeDirectionTimeout * 1000) as any as number;
  }

  /**
   * Stops `Currency Direction Timeout` timer.
   *
   * @return {void}
   */
  stopCurrencyDirectionTimeout (): void {
    if (_.isNil(this.currencyDirectionTimeoutTimer) === false) {
      clearTimeout(this.currencyDirectionTimeoutTimer);
      this.currencyDirectionTimeoutTimer = null;
    }
  }

  /**
   * Marks all updated currency as non-changed.
   *
   * @return {void}
   */
  private resetCurrencyUpdateStates (): void {
    const allUpdatedCurencyRates = this.currencyRateRS.findAll({
      updateState: {
        '!==' : Enums.CurrencyUpdateState.Equal,
      },
    });

    const currencyStatesWithResetUpdateState = _.map(allUpdatedCurencyRates, (curencyRates) => {
      return {
        ...curencyRates,
        updateState: Enums.CurrencyUpdateState.Equal,
      };
    });

    this.currencyRateRS.inject(currencyStatesWithResetUpdateState);
    this.sjNotif.next();
  }
}
