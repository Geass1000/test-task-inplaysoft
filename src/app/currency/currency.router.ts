import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrencyMainComponent } from './components/currency-main';

const routes: Routes = [
  {
    path: '',
    component: CurrencyMainComponent,
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
