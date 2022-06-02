import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';

import { BaseComponent } from '@shared';

// RS
import { CurrencyRateRS } from '../../resources/currency-rate.rs';

// Services
import { CurrencyHistoryArbiter } from '../../services/currency-history.arbiter';

// SS

import { Interfaces } from '../../shared';
import { CurrencyArbiter } from '../../services/currency.arbiter';

@Component({
  selector: 'ag-currency-report',
  templateUrl: './currency-report.component.html',
  styleUrls: [ './currency-report.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyReportComponent extends BaseComponent implements OnInit {
  public activeCurrencyId: string;

  public chartDataMap: Map<string, ChartConfiguration['data']> = new Map();
  public chartData: ChartConfiguration['data'];

  public currencyRates: Interfaces.CurrencyRate[];

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0,
      },
    },
    scales: {
      x: {},
      'y-axis-0': {
        position: 'left',
      },
    },
  };

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // Services
    private currencyHistoryArbiter: CurrencyHistoryArbiter,
    private currencyArbiter: CurrencyArbiter,
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
  ) {
    super(changeDetection);
  }

  /**
   * Inits component:
   *  - starts observer for `Currency Rate` resource store to update view.
   *
   * @return {void}
   */
  async ngOnInit (
  ): Promise<void> {
    const currencyRateRS$ = this.currencyArbiter.getObserver()
      .subscribe(() => {
        this.updateView();
      });
    this.subscribe(currencyRateRS$);

    this.updateView();
  }

  /**
   * Gets the current currency rates from resource storage and sets them in table.
   *
   * @return {void}
   */
  updateView (): void {
    this.currencyRates = this.currencyRateRS.findAll();

    _.forEach(this.currencyRates, (currencyRate) => {
      const currencyRateHistory = this.currencyHistoryArbiter.getCurrencyRateHistory(currencyRate.id);

      const allCurrencyRateValues = _.map(currencyRateHistory, 'value');
      allCurrencyRateValues.push(currencyRate.value);

      const allCurrencyRateDates = _.map(currencyRateHistory, (currencyRatePayload) => {
        return currencyRatePayload.createdAt.toISOString();
      });
      allCurrencyRateDates.push(currencyRate.createdAt.toISOString());

      const chartData = {
        datasets: [
          {
            data: allCurrencyRateValues,
            label: currencyRate.name,
          },
        ],
        labels: allCurrencyRateDates,
      } as ChartConfiguration['data'];

      this.chartDataMap.set(currencyRate.id, chartData);
    });

    // Select first currency rate and set its chart data as a default
    if (_.isNil(this.activeCurrencyId) === true) {
      this.setActiveCurrency(this.currencyRates[0]?.id);
    }

    this.updateChartData();
  }

  /**
   * Handles `model change` events on `Currency` select element. Selects the new active currency.
   *
   * @return {void}
   */
  onChangeActiveCurrency (
    currencyId: string,
  ): void {
    this.setActiveCurrency(currencyId);
  }

  /**
   * Sets the new active currency. Finds a chart data for this currency and renders it.
   *
   * @param  {string} activeCurrencyId
   * @return {void}
   */
  setActiveCurrency (
    activeCurrencyId: string,
  ): void {
    this.activeCurrencyId = activeCurrencyId;
    this.updateChartData();
  }

  /**
   * Extracts the current chart data for the active currency and updates the chart.
   *
   * @return {void}
   */
  updateChartData (): void {
    const chartData = this.chartDataMap.get(this.activeCurrencyId);
    if (_.isNil(chartData) === false) {
      this.chartData = chartData;
    }
    this.forceRender();
  }
}
