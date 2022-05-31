import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BaseManager } from '../../shared';

// Services
import { CurrencyRatesArbiter } from './currency-rates.arbiter';

// SS

// RS
import { CurrencyRateRS } from '../resources/currency-rate.rs';

import type { Interfaces } from '../shared';
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
    private httpClient: HttpClient,
    // Engines
    private currencyRatesArbiter: CurrencyRatesArbiter,
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
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

  async $init (): Promise<void> {
    await this.updateCurrencyRates();

    const currencyUpdateIntervalSec = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyUpdateInterval, 15);

    this.startCurrencyUpdateInterval(currencyUpdateIntervalSec);
  }

  /**
   * Starts `Currency Update Interval` timer.
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
   * Loads the new currency rates and saves them in resource store.
   *
   * @return {Promise<void>}
   */
  private async updateCurrencyRates (): Promise<void> {
    try {
      const currencyRates = await this.loadCurrentCurrencyRates();

      this.currencyRatesArbiter.updateCurrencyRates(currencyRates);
    } catch (error) {
      console.error(`CurrencyArbiter.startCurrencyUpdateInterval: Can't load currency rates. Error:`, error);
    }
  }

  /**
   * Loads the list of current currency rates.
   *
   * @return {Promise<Interfaces.CurrencyRate[]>}
   */
  private async loadCurrentCurrencyRates (): Promise<Interfaces.CurrencyRate[]> {
    const endpoint = `https://api.coingecko.com/api/v3/exchange_rates`;
    const resp = await this.httpClient.get<Interfaces.CurrencyRatesResp>(endpoint).toPromise();

    const currencyRates = _.map(resp.rates, (currencyRate, currencyId) => {
      return {
        ...currencyRate,
        id: currencyId,
        createdAt: new Date(),
      } as Interfaces.CurrencyRate;
    });

    return currencyRates;
  }
}
