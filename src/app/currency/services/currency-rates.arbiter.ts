import { Injectable } from '@angular/core';

import * as luxon from 'luxon';

import { BaseManager } from '../../shared';

// Services

// SS

// RS
import { CurrencyRateRS } from '../resources/currency-rate.rs';

import type { Interfaces } from '../shared';
import { Enums } from '../shared';

@Injectable()
export class CurrencyRatesArbiter extends BaseManager {
  private prevCurrencyRates: Map<string, Interfaces.CurrencyRatePayload[]> = new Map();

  constructor (
    // Engines
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
  ) {
    super();
  }

  async $init (): Promise<void> {
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

    const currencyRatesWithStats = _.map(currencyRates, (currencyRate) => {
      const prevCurrencyRate = _.find(prevCurrencyRates, [ 'id', currencyRate.id ]);

      return {
        ...currencyRate,
        ...this.calculateCurrencyStats(currencyRate),
        updateState: this.calculateUpdateState(prevCurrencyRate, currencyRate),
      };
    });

    const updatedCurrencyRates = this.currencyRateRS.inject(currencyRatesWithStats);
    console.log(updatedCurrencyRates);
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
    const prevCurrencyRateValues = this.prevCurrencyRates.get(currencyRate.id) ?? [];

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

    _.forEach(prevCurrencyRates, (currencyRate) => {
      const prevCurrencyRateValues = this.prevCurrencyRates.get(currencyRate.id) ?? [];

      // FYI[WORKFLOW]: Store minimized object to reduce memory usage
      const newShortCurrencyRate: Interfaces.CurrencyRatePayload = {
        value: currencyRate.value,
        createdAt: currencyRate.createdAt,
      };

      const updatedRateValues = [ ...prevCurrencyRateValues ];
      if (prevCurrencyRateValues.length < 10) {
        updatedRateValues.push(newShortCurrencyRate);
      } else {
        updatedRateValues.splice(0, 1, newShortCurrencyRate);
      }

      this.prevCurrencyRates.set(currencyRate.id, updatedRateValues);
    });
  }
}
