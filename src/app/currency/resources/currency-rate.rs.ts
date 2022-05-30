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
  };
}
