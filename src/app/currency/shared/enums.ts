
export enum LocalStorageKey {
  CurrencyChangeDirectionTimeout = `CurrencyChangeDirectionTimeout`,
  CurrencyUpdateInterval = `CurrencyUpdateInterval`,
  CurrencyRatesHistory = `CurrencyRatesHistory`,
  CurrencyRatesHistoryMinCapacity = `CurrencyRatesHistoryMinCapacity`,
  CurrencyRatesHistoryMaxCapacity = `CurrencyRatesHistoryMaxCapacity`,
}

export enum CurrencyUpdateState {
  Equal = 'Equal',
  More = 'More',
  Less = 'Less',
}

export const StateStoreName = `currency`;
export const State = {
  CurrencyUpdateInterval: [ StateStoreName, 'currencyUpdateInterval' ],
  CurrencyChangeDirectionTimeout: [ StateStoreName, 'currencyChangeDirectionTimeout' ],
};
