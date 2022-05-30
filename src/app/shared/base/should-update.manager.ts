
export class ShouldUpdateManager {
  private shouldUpdateSetsMap: Map<string, any[]>;

  constructor () {
    // Inits
    this.shouldUpdateSetsMap = new Map();
  }

  /**
   * Resets `shouldUpdateSets` map.
   *
   * @return {void}
   */
  $destroy (): void {
    this.shouldUpdateSetsMap.clear();
  }

  /**
   * Returns `true` if we allow to update the logic for this label (non-recursive comparison).
   *
   * @param  {string} key
   * @param  {any[]} params
   * @return {boolean}
   */
  shouldUpdate (
    key: string,
    params: any[],
  ): boolean {
    if (typeof key !== 'string') {
      throw new Error(`ShouldUpdateManager.shouldUpdate: `
        + `Label is required!`);
    }
    if (Array.isArray(params) === false) {
      throw new Error(`ShouldUpdateManager.shouldUpdate: `
        + `Params are required!`);
    }

    const oldParams = this.shouldUpdateSetsMap.get(key);
    if (Array.isArray(oldParams) === false) {
      this.shouldUpdateSetsMap.set(key, params);
      return true;
    }

    if (params.length !== oldParams.length) {
      this.shouldUpdateSetsMap.set(key, params);
      return true;
    }

    const somethingIsChanged = params.some((param, index) => {
      return oldParams[index] !== param;
    });

    if (somethingIsChanged === true) {
      this.shouldUpdateSetsMap.set(key, params);
    }

    return somethingIsChanged;
  }

  /**
   * Resets the `should update` logic by key.
   *
   * @param  {string} key
   * @return {void}
   */
  resetKey (
    key: string,
  ): void {
    if (typeof key !== 'string') {
      throw new Error(`ShouldUpdateManager.resetKey: `
        + `Label is required!`);
    }

    this.shouldUpdateSetsMap.delete(key);
  }
}
