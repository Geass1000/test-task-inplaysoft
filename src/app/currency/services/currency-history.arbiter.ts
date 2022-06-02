import { Injectable } from '@angular/core';

import * as luxon from 'luxon';

import { BaseManager } from '../../shared';

// Services
import { CurrencyService } from './currency.service';

// SS

// RS
import { CurrencyRateRS } from '../resources/currency-rate.rs';

import type { Interfaces } from '../shared';
import { Enums } from '../shared';

@Injectable()
export class CurrencyHistoryArbiter extends BaseManager {
  private prevCurrencyRatesMap: Map<string, Interfaces.CurrencyRatePayload[]> = new Map();
  /**
   * FYI: We should store more history items than number in this property.
   */
  private MinHistoryCapacity: number;
  /**
   * FYI: We should save less history items than number in this property.
   */
  private MaxHistoryCapacity: number;

  constructor (
    // Services
    private currencyService: CurrencyService,
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
  ) {
    super();
  }

  /**
   * Inits the arbiter:
   *  - loads the previous currency rates history and sets it in local property.
   *
   * @return {Promise<void>}
   */
  async $init (): Promise<void> {
    const prevCurrencyRatesHistory = await this.currencyService.loadCurrencyRatesHistory();
    this.MinHistoryCapacity = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyRatesHistoryMinCapacity, 10);
    this.MaxHistoryCapacity = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyRatesHistoryMaxCapacity, 100);

    this.prevCurrencyRatesMap.clear();
    _.forEach(prevCurrencyRatesHistory, (currencyRateHistoryItem) => {
      this.prevCurrencyRatesMap.set(currencyRateHistoryItem.id, currencyRateHistoryItem.rates);
    });
  }

  /**
   * Destroys the arbiter:
   *  - clears the prev currency rates.
   */
  $destroy (): void {
    this.prevCurrencyRatesMap.clear();
  }

  /**
   * Returns the currency rate history.
   *
   * @param  {string} id
   * @return {Interfaces.CurrencyRatePayload[]}
   */
  getCurrencyRateHistory (
    id: string,
  ): Interfaces.CurrencyRatePayload[] {
    const rateHistory = this.prevCurrencyRatesMap.get(id) ?? [];
    return [ ...rateHistory ];
  }

  /**
   * Loads the new currency rates and saves them in resource store.
   *
   * @return {Promise<void>}
   */
  updateCurrencyRates (
    currencyRates: Interfaces.CurrencyRate[],
  ): void {
    const prevCurrencyRates = this.currencyRateRS.findAll();
    this.savePrevCurrencyRates(prevCurrencyRates);

    // TODO[NEXT]: Remove this step after we've implemented logic to load currency history from store
    this.savePrevCurrencyRatesToStore();

    const currencyRatesWithStats = _.map(currencyRates, (currencyRate) => {
      const prevCurrencyRate = _.find(prevCurrencyRates, [ 'id', currencyRate.id ]);

      return {
        ...currencyRate,
        ...this.calculateCurrencyStats(currencyRate),
        updateState: this.calculateUpdateState(prevCurrencyRate, currencyRate),
      };
    });

    this.currencyRateRS.inject(currencyRatesWithStats);
  }

  /**
   * Calculates update state - if new currency rate is equal / more / less than previous one.
   *
   * @param  {Interfaces.CurrencyRate} prevCurrencyRate
   * @param  {Interfaces.CurrencyRate}currencyRate
   * @return {Enums.CurrencyUpdateState}
   */
  private calculateUpdateState (
    prevCurrencyRate: Interfaces.CurrencyRate,
    currencyRate: Interfaces.CurrencyRate,
  ): Enums.CurrencyUpdateState {
    if (_.isNil(prevCurrencyRate) === true || prevCurrencyRate.value === currencyRate.value) {
      return Enums.CurrencyUpdateState.Equal;
    }

    return prevCurrencyRate.value > currencyRate.value
      ? Enums.CurrencyUpdateState.Less : Enums.CurrencyUpdateState.More;
  }

  /**
   * Calculates all currency stats for the provided currency rate.
   *
   * @param  {Interfaces.CurrencyRate} currencyRate
   * @return {Interfaces.CurrencyRateStats}
   */
  private calculateCurrencyStats (
    currencyRate: Interfaces.CurrencyRate,
  ): Interfaces.CurrencyRateStats {
    const prevCurrencyRateValues = this.prevCurrencyRatesMap.get(currencyRate.id) ?? [];

    const allCurrencyRateValues = [ ...prevCurrencyRateValues, currencyRate ];
    const curDateLx = luxon.DateTime.local();

    return {
      avg1Min: this.calculateAvgRateWithOffset(allCurrencyRateValues, curDateLx.minus({ minutes: 1 })),
      avg2Min: this.calculateAvgRateWithOffset(allCurrencyRateValues, curDateLx.minus({ minutes: 2 })),
      avg3Min: this.calculateAvgRateWithOffset(allCurrencyRateValues, curDateLx.minus({ minutes: 3 })),
      avg5Min: this.calculateAvgRateWithOffset(allCurrencyRateValues, curDateLx.minus({ minutes: 5 })),
      min: _.minBy(allCurrencyRateValues, 'value').value,
      max: _.maxBy(allCurrencyRateValues, 'value').value,
    };
  }

  /**
   * Calculates the average currency rate after the provided date.
   *
   * @param  {Interfaces.CurrencyRatePayload[]} currencyRatePayloads
   * @param  {luxon.DateTime} minDateLx
   * @return {number}
   */
  private calculateAvgRateWithOffset (
    currencyRatePayloads: Interfaces.CurrencyRatePayload[],
    minDateLx: luxon.DateTime,
  ): number {
    const minDate = minDateLx.toJSDate();
    const currencyRatePayloadsAfterDate = _.filter(currencyRatePayloads, (currencyRatePayload) => {
      return currencyRatePayload.createdAt >= minDate;
    });

    const sumOfRates = _.sumBy(currencyRatePayloadsAfterDate, 'value');

    const avgRate = sumOfRates / currencyRatePayloadsAfterDate.length;
    return avgRate;
  }

  /**
   * Saves the previous currency rates.
   *
   * @return {void}
   */
  private savePrevCurrencyRates (
    prevCurrencyRates: Interfaces.CurrencyRate[],
  ): void {
    if (_.isEmpty(prevCurrencyRates) === true){
      return;
    }
    const curDateLx = luxon.DateTime.local();
    const date5MinsAgo = curDateLx.minus({ minutes: 5 }).toJSDate();

    _.forEach(prevCurrencyRates, (currencyRate) => {
      const prevCurrencyRatePayloads = this.prevCurrencyRatesMap.get(currencyRate.id) ?? [];

      // FYI[WORKFLOW]: Store minimized object to reduce memory usage
      const newShortCurrencyRate: Interfaces.CurrencyRatePayload = {
        value: currencyRate.value,
        createdAt: currencyRate.createdAt,
      };

      const nonStaleCurrencyRatesPayloads: Interfaces.CurrencyRatePayload[] = [];
      for (let i = prevCurrencyRatePayloads.length - 1; i >= 0; i--) {
        if (nonStaleCurrencyRatesPayloads.length > this.MaxHistoryCapacity) {
          break;
        }

        // Try to save only actual data but more than min history capacity
        const currencyRatePayload = prevCurrencyRatePayloads[i];
        if (currencyRatePayload.createdAt < date5MinsAgo
            && nonStaleCurrencyRatesPayloads.length >= this.MinHistoryCapacity) {
          break;
        }

        nonStaleCurrencyRatesPayloads.push(currencyRatePayload);
      }

      const nonStaleCurrencyRatesPayloadsByDesc = nonStaleCurrencyRatesPayloads.reverse();
      nonStaleCurrencyRatesPayloadsByDesc.push(newShortCurrencyRate);

      this.prevCurrencyRatesMap.set(currencyRate.id, nonStaleCurrencyRatesPayloadsByDesc);
    });
  }

  /**
   * Parses current currency history and saves it to store (Local Storage).
   *
   * @return {void}
   */
  private savePrevCurrencyRatesToStore (): void {
    const historyItems: Interfaces.CurrencyRateHistoryItem[] = [];
    this.prevCurrencyRatesMap.forEach((currencyRatePayloads, currencyId) => {
      historyItems.push({
        id: currencyId,
        rates: currencyRatePayloads,
      });
    });
    this.localStorageService.setValue(Enums.LocalStorageKey.CurrencyRatesHistory, historyItems);
  }
}
