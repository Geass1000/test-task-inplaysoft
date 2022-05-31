import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as AgGrid from 'ag-grid-community';

import { BaseComponent } from '@shared';

// RS
import { CurrencyRateRS } from '../../resources/currency-rate.rs';

// Services

// SS

import { Enums, Interfaces } from '../../shared';

@Component({
  selector: 'ag-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: [ './currency-rates.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyRatesComponent extends BaseComponent implements OnInit {
   // Each Column Definition results in one Column.
  public columnDefs: AgGrid.ColDef[] = [
    {
      field: 'name',
      width: 150,
    },
    {
      field: 'updateState',
      width: 50,
      valueGetter: (data: AgGrid.ValueGetterParams): string => {
        if (data.data.updateState === Enums.CurrencyUpdateState.Equal) {
          return '';
        }

        return data.data.updateState === Enums.CurrencyUpdateState.Less
          ? `↓` : `↑`;
      },
    },
    {
      field: 'value',
      width: 120,
    },
    {
      field: 'unit',
      width: 80,
    },
    {
      headerName: 'Average (1 min)',
      field: 'avg1Min',
      width: 170,
    },
    {
      headerName: 'Average (2 min)',
      field: 'avg2Min',
      width: 170,
    },
    {
      headerName: 'Average (3 min)',
      field: 'avg3Min',
      width: 170,
    },
    {
      headerName: 'Average (5 min)',
      field: 'avg5Min',
      width: 170,
    },
    {
      headerName: 'Min',
      field: 'min',
      width: 120,
    },
    {
      headerName: 'Max',
      field: 'max',
      width: 120,
    },
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: AgGrid.ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData: Interfaces.CurrencyRate[];

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // RS
    private currencyRateRS: CurrencyRateRS,
    // SS
  ) {
    super(changeDetection);

    this.getRowId = this.getRowId.bind(this);
  }

  /**
   * Inits component:
   *  - starts observer for `Currency Rate` resource store to update view.
   *
   * @return {void}
   */
  async ngOnInit (
  ): Promise<void> {
    const currencyRateRS$ = this.currencyRateRS.getInjectObserver()
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
    this.rowData = this.currencyRateRS.findAll();

    const values = _.map(this.rowData, (currencyRate) => {
      return this.getFullCurrencyRateId(currencyRate);
    });
    this.render(`updateView`, values);
  }

  /**
   * Calculates and returns data id.
   *
   * @param  {AgGrid.GetRowIdParams} params
   * @return
   */
  getRowId (params: AgGrid.GetRowIdParams): string {
    return this.getFullCurrencyRateId(params.data as Interfaces.CurrencyRate);
  }

  /**
   * Calculates and returns the full currency rate id.
   *
   * @param  {Interfaces.CurrencyRate} currencyRate
   * @return {string}
   */
  getFullCurrencyRateId (
    currencyRate: Interfaces.CurrencyRate,
  ): string {
    return `${currencyRate.id}-${currencyRate.value}-${currencyRate.updateState}`;
  }
}
