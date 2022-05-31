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
    // RS
    // SS
  ) {
    super(changeDetection);
  }

  async ngOnInit (
  ): Promise<void> {
    // Init arbiters
    await this.currencyArbiter.$init();

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
