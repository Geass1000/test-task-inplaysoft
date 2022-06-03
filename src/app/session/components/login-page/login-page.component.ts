import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '@shared';
import { BaseError } from '../../../shared/errors/error.base';

// Services
import { SessionService } from '../../services/session.service';

import { Enums } from '../../shared';

@Component({
  selector: 'ag-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: [ './login-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent extends BaseComponent implements OnInit {
  public email: string;
  public password: string;

  public errorMessage: string;

  constructor (
    // Angular
    protected changeDetection: ChangeDetectorRef,
    private router: Router,
    // Services
    private sessionService: SessionService,
  ) {
    super(changeDetection);
  }

  /**
   * Inits component:
   *
   * @return {Porimse<void>}
   */
  async ngOnInit (
  ): Promise<void> {
    this.forceRender();
  }

  /**
   * Handles `model change` events on form elements. Resets the error message.
   *
   * @return {void}
   */
  onChangeFormField (): void {
    this.errorMessage = '';
    this.render(`errorMessage`, [ this.errorMessage ]);
  }

  /**
   * Handles `click` events on `Login` button. Sends user's creeds to server to get session token.
   * If request returns an error, method'll delegate control to parse and show the error.
   *
   * @return {Promise<void>}
   */
  async onClickLogin (): Promise<void> {
    try {
      const token = await this.sessionService.login(this.email, this.password);
      this.localStorageService.setValue(Enums.LocalStorageKey.SessionToken, token);
      await this.router.navigateByUrl(`/`);
    } catch (error) {
      console.error(`[SESSION] LoginPageComponent.onClickLogin: Can't login. Error:`, error);
      this.handleError(error);
      this.forceRender();
    }
  }

  /**
   * Parses the error object and select the error message.
   *
   * @param  {any} error
   * @return {void}
   */
  handleError (
    error: any,
  ): void {
    const unknonError = `Something went wrong. Try later`;
    if (!(error instanceof BaseError)) {
      this.errorMessage = unknonError;
      return;
    }

    switch (error.code) {
      case Enums.ErrorCode.InvalidEmail:
      case Enums.ErrorCode.InvalidPassword:
        this.errorMessage = `Email or password is invalid`;
        break;
      default:
        this.errorMessage = unknonError;
        break;
    }
  }
}
