import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from '../session/services/session.guard';

import { CurrencyComponent } from './components/currency';
import { CurrencyMainComponent } from './components/currency-main';
import { CurrencyRatesComponent } from './components/currency-rates';
import { CurrencyReportComponent } from './components/currency-report';

const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent,
    canActivate: [ SessionGuard ],
    canActivateChild: [ SessionGuard ],
    children: [
      {
        path: 'rates',
        component: CurrencyRatesComponent,
      },
      {
        path: 'report',
        component: CurrencyReportComponent,
      },
      {
        path: '',
        component: CurrencyMainComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class CurrencyRouter { }
