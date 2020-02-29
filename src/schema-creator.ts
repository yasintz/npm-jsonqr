import {
  NONE_TYPE,
  CURRENT_ITEM_FILTER_KEY,
  SchemaTypeObje,
} from './constants';

function schemaCreator(schema: string): Array<SchemaTypeObje> {
  return schema
    .replace(/\s/g, '')
    .split('}')
    .map(i => i.split('{'))
    .slice(0, -1)
    .map(item => {
      const keys = item[1]
        .split(';')
        .filter(i => i)
        .map(line => {
          const splitedLine = line.split('@');
          const helpers = splitedLine.slice(1);
          const key = splitedLine[0].split(':')[0];
          const type = splitedLine[0].split(':')[1];
          return {
            key,
            helpers,
            type: type ? type : NONE_TYPE,
          };
        });
      const currentItemFilter = keys.find(
        item => item.key === CURRENT_ITEM_FILTER_KEY
      );

      return {
        typeName: item[0],
        keys: keys.filter(item => item.key != CURRENT_ITEM_FILTER_KEY),
        currentHelpers: currentItemFilter ? currentItemFilter.helpers : [],
      };
    }) as SchemaTypeObje[];
}

export default schemaCreator;
