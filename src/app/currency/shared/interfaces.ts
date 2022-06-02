import * as Enums from './enums';

export interface CurrencyRateStats {
  avg1Min?: number;
  avg2Min?: number;
  avg3Min?: number;
  avg5Min?: number;
  min?: number;
  max?: number;
  updateState?: Enums.CurrencyUpdateState;
}

export interface CurrencyRatePayload extends CurrencyRateStats {
  value: number;
  createdAt?: Date;
}

export interface CurrencyRate extends CurrencyRatePayload, CurrencyRateStats {
  id?: string;
  name: string;
  unit: string;
  type: string;
}

export interface CurrencyRatesResp {
  rates: {
    [key: string]: CurrencyRate;
  };
}

export interface CurrencyRateHistoryItem {
  id: string;
  rates: CurrencyRatePayload[];
}

export interface CurrencyStore {
  currencyUpdateInterval: number;
  currencyChangeDirectionTimeout: number;
}
