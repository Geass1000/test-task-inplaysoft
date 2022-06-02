import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';

// Modules
import { SharedModule } from '../shared/shared.module';
import { CurrencyRouter } from './currency.router';

// Components
import { CurrencyComponent } from './components/currency';
import { CurrencyMainComponent } from './components/currency-main';
import { CurrencyRatesComponent } from './components/currency-rates';
import { CurrencyReportComponent } from './components/currency-report';

// Services
import { CurrencyService } from './services/currency.service';
import { CurrencyArbiter } from './services/currency.arbiter';
import { CurrencyHistoryArbiter } from './services/currency-history.arbiter';

// RS
import { CurrencyRateRS } from './resources/currency-rate.rs';

// SS
import { CurrencyAction } from './currency.action';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    CurrencyRouter,
    AgGridModule,
    NgChartsModule,
  ],
  declarations: [
    // Components
    CurrencyComponent,
    CurrencyMainComponent,
    CurrencyRatesComponent,
    CurrencyReportComponent,
  ],
  providers: [
    // Services
    CurrencyService,
    CurrencyArbiter,
    CurrencyHistoryArbiter,
    // RS
    CurrencyRateRS,
    // SS
    CurrencyAction,
  ],
})
export class CurrencyModule {
  constructor (
  ) {
  }
}
