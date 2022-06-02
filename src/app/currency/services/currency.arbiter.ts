import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BaseManager } from '../../shared';

// Services
import { CurrencyService } from './currency.service';
import { CurrencyHistoryArbiter } from './currency-history.arbiter';

// SS
import { StateStore } from '@core/state-store';

// RS
import { Enums } from '../shared';

@Injectable()
export class CurrencyArbiter extends BaseManager {
  /**
   * Instance of Timer.
   * Loads the list of currency rates and saves them.
   */
  public currencyUpdateIntervalTimer: number;

  public sjNotif: Subject<number> = new Subject();

  constructor (
    // Service
    private currencyService: CurrencyService,
    private currencyHistoryArbiter: CurrencyHistoryArbiter,
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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.currencyUpdateIntervalTimer = setTimeout(async () => {
      await this.updateCurrencyRates();
      this.currencyUpdateIntervalTimer = null;

      // FYI: Next iteration. We don't use interval timer bz we want to start next iteration only after we get a
      // current currency rates. Macrotask level interval.
      this.startCurrencyUpdateInterval(currencyUpdateIntervalSec);
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
}
