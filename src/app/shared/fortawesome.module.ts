import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faTelegramPlane,
  faViber,
  faVk,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  providers: [
  ],
})
export class FortawesomeModule {
  constructor (
    faIconLibrary: FaIconLibrary,
  ) {
    faIconLibrary.addIcons(
      faBoxes,
      faTelegramPlane,
      faViber,
      faInstagram,
      faVk,
    );
  }
}
