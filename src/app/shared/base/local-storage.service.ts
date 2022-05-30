
export class LocalStorageService {
  constructor (
  ) {
  }

  /**
   * Removes the value from the local storage.
   *
   * @param  {string} localStorageKey
   * @return {void}
   */
  removeValue (
    localStorageKey: string,
  ): void {
    localStorage.removeItem(localStorageKey);
  }

  /**
   * Sets the value in the local storage.
   *
   * @param  {string} localStorageKey
   * @param  {any} value
   * @return {void}
   */
  setValue (
    localStorageKey: string,
    value: any,
  ): void {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }

  /**
   * Returns a value from the local storage.
   *
   * @param  {string} localStorageKey
   * @return {TValue}
   */
  getValue <TValue = any> (
    localStorageKey: string,
  ): TValue {
    const localStorageValue = localStorage.getItem(localStorageKey);

    if (_.isNil(localStorageValue) === true) {
      return;
    }

    try {
      return JSON.parse(localStorageValue);
    } catch (error) {
      return null;
    }
  }

  /**
   * Returns the boolean value from the local storage.
   *
   * @param  {string} localStorageKey
   * @return {boolean}
   */
  getBoolean (
    localStorageKey: string,
  ): boolean {
    const localStorageValue = localStorage.getItem(localStorageKey);
    return localStorageValue === 'true';
  }

  /**
   * Returns the number value from the local storage.
   *
   * @param  {string} localStorageKey
   * @param  {number} [defaultValue] - if not defined, method'll return NULL
   * @return {boolean}
   */
  getNumber (
    localStorageKey: string,
    defaultValue: number,
  ): number {
    const localStorageValue = localStorage.getItem(localStorageKey);

    if (_.isNil(localStorageValue) === false && _.isFinite(+localStorageValue) === true) {
      return +localStorageValue;
    }

    if (_.isNil(defaultValue) === true) {
      return null;
    }

    return defaultValue;
  }
}
