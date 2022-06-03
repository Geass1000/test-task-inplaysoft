import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseManager } from '@shared';
import { BaseError } from '@shared/errors/error.base';

import { Enums, Constants } from '../shared';

@Injectable()
export class SessionService extends BaseManager {
  constructor (
    private httpClient: HttpClient,
  ) {
    super();
  }

  /**
   * Gets the session token using email and password from args.
   *
   * @param  {string} email
   * @param  {string} password
   * @return {Promise<string>}
   */
  async login (
    email: string,
    password: string,
  ): Promise<string> {
    if (_.isEmpty(email) === true) {
      throw new BaseError(`[SESSION] SessionService.login: Email is required`, Enums.ErrorCode.InvalidEmail);
    }

    if (_.isEmpty(password) === true) {
      throw new BaseError(`[SESSION] SessionService.login: Password is required`, Enums.ErrorCode.InvalidPassword);
    }

    // TODO[NEXT]: Send request to backend to validate login creeds and get session token

    return Constants.SessionToken;
  }
}
