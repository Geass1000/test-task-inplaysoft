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
import { StateStore } from '@core/state-store';
import { CurrencyAction } from '../../currency.action';

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

  public currencyDirectionLimitWarningIsShown = false;

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // Services
    private currencyArbiter: CurrencyArbiter,
    // RS
    // SS
    private stateStore: StateStore,
    private currencyAction: CurrencyAction,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component:
   *  - gets from state store currency interval and direction timeout and uses them to init form;
   *
   * @return {void}
   */
  async ngOnInit (
  ): Promise<void> {
    // Init form
    this.currencyUpdateInterval = this.stateStore.getState(Enums.State.CurrencyUpdateInterval);
    this.currencyChangeDirectionTimeout = this.stateStore.getState(Enums.State.CurrencyChangeDirectionTimeout);

    this.updateCurrencyDirectionView();
    this.forceRender();
  }

  /**
   * Updates currency direction view.
   *
   * @return {void}
   */
  updateCurrencyDirectionView (): void {
    this.currencyDirectionLimitWarningIsShown = this.currencyChangeDirectionTimeout >= this.currencyUpdateInterval;
    this.render(`updateCurrencyDirectionView`, [ this.currencyDirectionLimitWarningIsShown ]);
  }

  /**
   * Handles `changes` of `Currency Change Direction Timeout` input.
   * TODO[COMMENT]: ...
   *
   * @return {void}
   */
  onChangeCurrencyUpdateInterval (): void {
    if (_.isNil(this.currencyUpdateInterval) === true) {
      return;
    }

    console.log(`Currency Update Interval:`, this.currencyUpdateInterval);
    this.currencyArbiter.startCurrencyUpdateInterval(this.currencyUpdateInterval);
    this.localStorageService.setValue(Enums.LocalStorageKey.CurrencyUpdateInterval, this.currencyUpdateInterval);
    this.currencyAction.setCurrencyChangeDirectionTimeout(this.currencyUpdateInterval);
  }

  /**
   * Handles `changes` of `Currency Change Direction Timeout` input.
   * TODO[COMMENT]: ...
   *
   * @return {void}
   */
  onChangeCurrencyChangeDirectionTimeout (): void {
    if (_.isNil(this.currencyChangeDirectionTimeout) === true) {
      return;
    }

    console.log(`Currency Change Direction Timeout:`, this.currencyChangeDirectionTimeout);
    this.localStorageService.setValue(
      Enums.LocalStorageKey.CurrencyChangeDirectionTimeout, this.currencyChangeDirectionTimeout,
    );
    this.currencyAction.setCurrencyChangeDirectionTimeout(this.currencyChangeDirectionTimeout);

    this.updateCurrencyDirectionView();

    if (this.currencyDirectionLimitWarningIsShown === false) {
    }
  }
}
