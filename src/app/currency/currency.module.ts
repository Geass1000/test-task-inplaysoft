import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

// Modules
import { SharedModule } from '../shared/shared.module';
import { CurrencyRouter } from './currency.router';

// Components
import { CurrencyComponent } from './components/currency';
import { CurrencyMainComponent } from './components/currency-main';
import { CurrencyRatesComponent } from './components/currency-rates';

// Services
import { CurrencyService } from './services/currency.service';
import { CurrencyArbiter } from './services/currency.arbiter';
import { CurrencyHistoryArbiter } from './services/currency-history.arbiter';

// RS
import { CurrencyRateRS } from './resources/currency-rate.rs';

// SS

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    CurrencyRouter,
    AgGridModule,
  ],
  declarations: [
    // Components
    CurrencyComponent,
    CurrencyMainComponent,
    CurrencyRatesComponent,
  ],
  providers: [
    // Services
    CurrencyService,
    CurrencyArbiter,
    CurrencyHistoryArbiter,
    // RS
    CurrencyRateRS,
  ],
})
export class CurrencyModule {
  constructor (
  ) {
  }
}
