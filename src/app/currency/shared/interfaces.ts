
export interface CurrencyRate {
  id?: string;
  name: string;
  unit: string;
  value: number;
  type: string;
}

export interface CurrencyRatesResp {
  rates: {
    [key: string]: CurrencyRate;
  };
}
