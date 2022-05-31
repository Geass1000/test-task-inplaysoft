import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrencyComponent } from './components/currency';
import { CurrencyMainComponent } from './components/currency-main';
import { CurrencyRatesComponent } from './components/currency-rates';

const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent,
    children: [
      {
        path: 'rates',
        component: CurrencyRatesComponent,
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
