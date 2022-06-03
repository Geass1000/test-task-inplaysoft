import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanActivateChild,
} from '@angular/router';

import { BaseManager } from '@shared';

import * as SessionModuleEnums from '../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard extends BaseManager implements CanActivate, CanActivateChild {

  constructor (
    private router: Router,
  ) {
    super();
  }

  /**
   * Checks if user has session token. If there is no token in Local Storage, logic'll redirect
   * user to login page.
   *
   * @return {Promise<boolean>}
   */
  async canActivate (
  ): Promise<boolean> {
    const token = this.localStorageService
      .getValue(SessionModuleEnums.LocalStorageKey.SessionToken);

    if (_.isNil(token) === true) {
      await this.router.navigateByUrl(`/login`);
      return;
    }

    return true;
  }

  /**
   * Delegates control to `canActivate` logic.
   *
   * @return {Promise<boolean>}
   */
  async canActivateChild (
  ): Promise<boolean> {
    return this.canActivate();
  }
}
