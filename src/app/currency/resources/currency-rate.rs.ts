import * as KxModule from '@krix/module';
import * as KrixRS from '@krix/resource-store';

import { Interfaces } from '../shared';

const SchemaType = KrixRS.Enums.SchemaType;

@KxModule.Dependency()
export class CurrencyRateRS extends KrixRS.ResourceStore<Interfaces.CurrencyRate> {
  public name = 'CurrencyRate';

  public schema: KrixRS.Interfaces.Schema<Interfaces.CurrencyRate> = {
    id: SchemaType.String,
    name: SchemaType.String,
    unit: SchemaType.String,
    value: SchemaType.Number,
    type: SchemaType.String,

    createdAt: SchemaType.Date,
    // Stats
    avg1Min: SchemaType.Number,
    avg2Min: SchemaType.Number,
    avg3Min: SchemaType.Number,
    avg5Min: SchemaType.Number,
    min: SchemaType.Number,
    max: SchemaType.Number,
    updateState: SchemaType.String,
  };
}
