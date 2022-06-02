import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { BaseComponent } from '@shared';

// RS

// Services
import { CurrencyArbiter } from '../../services/currency.arbiter';

// SS

import { Enums } from '../../shared';

@Component({
  selector: 'ag-currency-main',
  templateUrl: './currency-main.component.html',
  styleUrls: [ './currency-main.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyMainComponent extends BaseComponent implements OnInit {
  public currencyUpdateInterval: number;
  public currencyChangeDirectionTimeout: number = 5;

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // Services
    private currencyArbiter: CurrencyArbiter,
    // RS
    // SS
  ) {
    super(changeDetection);
  }

  async ngOnInit (
  ): Promise<void> {
    // Init form
    this.currencyUpdateInterval = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyUpdateInterval, 10);

    this.forceRender();
  }

  /**
   * Handles `changes` of `Currency Change Direction Timeout` input.
   * TODO[COMMENT]: ...
   *
   * @return {void}
   */
  onChangeCurrencyUpdateInterval (): void {
    if (_.isNil(this.onChangeCurrencyUpdateInterval) === true) {
      return;
    }

    console.log(`Currency Update Interval:`, this.currencyUpdateInterval);
    this.currencyArbiter.startCurrencyUpdateInterval(this.currencyUpdateInterval);
    this.localStorageService.setValue(Enums.LocalStorageKey.CurrencyUpdateInterval, this.currencyUpdateInterval);
  }

  /**
   * Handles `changes` of `Currency Change Direction Timeout` input.
   * TODO[COMMENT]: ...
   *
   * @return {void}
   */
  onChangeCurrencyChangeDirectionTimeout (): void {
    console.log(`Currency Change Direction Timeout:`, this.currencyChangeDirectionTimeout);
  }
}
