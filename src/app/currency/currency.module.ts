import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { CurrencyRouter } from './currency.router';

// Components
import { CurrencyMainComponent } from './components/currency-main';

// Services
import { CurrencyArbiter } from './services/currency.arbiter';
import { CurrencyRatesArbiter } from './services/currency-rates.arbiter';

// RS
import { CurrencyRateRS } from './resources/currency-rate.rs';

// SS

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    CurrencyRouter,
  ],
  declarations: [
    // Components
    CurrencyMainComponent,
  ],
  providers: [
    // Services
    CurrencyArbiter,
    CurrencyRatesArbiter,
    // RS
    CurrencyRateRS,
  ],
})
export class CurrencyModule {
  constructor (
  ) {
  }
}
