import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { BaseComponent } from '@shared';

// RS

// Services

// SS

@Component({
  selector: 'ag-currency-main',
  templateUrl: './currency-main.component.html',
  styleUrls: [ './currency-main.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyMainComponent extends BaseComponent implements OnInit {
  public currencyUpdateInterval: number = 10;
  public currencyChangeDirectionTimeout: number = 5;

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // Services
    // RS
    // SS
  ) {
    super(changeDetection);
  }

  async ngOnInit (
  ): Promise<void> {
    this.forceRender();
  }

  /**
   * Handles `changes` of `Currency Change Direction Timeout` input.
   * TODO[COMMENT]: ...
   *
   * @return {void}
   */
  onChangeCurrencyUpdateInterval (): void {
    console.log(`Currency Update Interval:`, this.currencyUpdateInterval);
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
