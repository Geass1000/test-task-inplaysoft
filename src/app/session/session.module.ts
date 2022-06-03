import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '../shared/shared.module';
import { SessionRouter } from './session.router';

// Components
import { LoginPageComponent } from './components/login-page';

// Services
import { SessionService } from './services/session.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    SessionRouter,
  ],
  declarations: [
    // Components
    LoginPageComponent,
  ],
  providers: [
    // Services
    SessionService,
  ],
})
export class SessionModule {
  constructor (
  ) {
  }
}
