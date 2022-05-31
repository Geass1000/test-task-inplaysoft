import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseManager } from '../../shared';

import type { Interfaces } from '../shared';
import { Enums } from '../shared';

@Injectable()
export class CurrencyService extends BaseManager {
  constructor (
    private httpClient: HttpClient,
  ) {
    super();
  }

  /**
   * Loads the list of payoads of currency rates for the last 5 mins.
   *
   * TODO[STUB][NEXT]: Load the history rates on initialization step from server instead of browser store.
   *
   * @return {Promise<Interfaces.CurrencyRateHistoryItem[]>}
   */
  async loadCurrencyRatesHistory (): Promise<Interfaces.CurrencyRateHistoryItem[]> {
    const currencyRatesHistory = this.localStorageService
      .getValue(Enums.LocalStorageKey.CurrencyRatesHistory) ?? [];

    return currencyRatesHistory;
  }

  /**
   * Loads the list of current currency rates.
   *
   * @return {Promise<Interfaces.CurrencyRate[]>}
   */
  async loadCurrentCurrencyRates (): Promise<Interfaces.CurrencyRate[]> {
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
