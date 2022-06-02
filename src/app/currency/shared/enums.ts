
export enum LocalStorageKey {
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
