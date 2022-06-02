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
import { CurrencyHistoryArbiter } from '../../services/currency-history.arbiter';

// SS
import { CurrencyAction } from '../../currency.action';

import { Enums } from '../../shared';

interface Route {
  label: string;
  path: string;
}

@Component({
  selector: 'ag-currency',
  templateUrl: './currency.component.html',
  styleUrls: [ './currency.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent extends BaseComponent implements OnInit {
  public routes: Route[] = [
    {
      label: 'Main',
      path: '',
    },
    {
      label: 'Report',
      path: '/report',
    },
    {
      label: 'Rates',
      path: '/rates',
    },
  ];

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    // Services
    private currencyArbiter: CurrencyArbiter,
    private currencyHistoryArbiter: CurrencyHistoryArbiter,
    // RS
    // SS
    private currencyAction: CurrencyAction,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component:
   *  - inits currency interval and direction timeout in state store;
   *  - start currency history arbiter;
   *  - start currency arbiter;
   *
   * @return {Porimse<void>}
   */
  async ngOnInit (
  ): Promise<void> {
    // Init state store
    const currencyUpdateInterval = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyUpdateInterval, 15);
    this.currencyAction.setCurrencyUpdateInterval(currencyUpdateInterval);

    const currencyChangeDirectionTimeout = this.localStorageService
      .getNumber(Enums.LocalStorageKey.CurrencyChangeDirectionTimeout, 10);
    this.currencyAction.setCurrencyChangeDirectionTimeout(currencyChangeDirectionTimeout);

    // Init arbiters
    await this.currencyHistoryArbiter.$init();
    this.registerManager(this.currencyHistoryArbiter);
    await this.currencyArbiter.$init();
    this.registerManager(this.currencyArbiter);

    this.forceRender();
  }

  /**
   * Triggers a render of UI if router outlet renders component.
   *
   * FYI[WORKAROUND]: Angular doesn't trigger component's hooks if we load them via Router.
   * We observe and `activate` output property to trigger a render manually.
   *
   * @return {void}
   */
  onRouteActivated (): void {
    this.forceRender();
  }
}
