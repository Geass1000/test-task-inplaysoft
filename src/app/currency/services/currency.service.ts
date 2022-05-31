import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseManager } from '../../shared';

import type { Interfaces } from '../shared';

@Injectable()
export class CurrencyService extends BaseManager {
  constructor (
    private httpClient: HttpClient,
  ) {
    super();
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
