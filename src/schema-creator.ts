import {
  NONE_TYPE,
  CURRENT_ITEM_KEY,
  SchemaTypeObje,
  HELPERS_PREFIX,
  DONE_HELPER_PREFIX,
  ALL_ITEM_PREFIX,
} from './constants';

const DONE_HELPER = `${DONE_HELPER_PREFIX}()`;

function schemaCreator(schema: string): Array<SchemaTypeObje> {
  return (
    schema
      // remove comments
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
      // remove spaces and lines
      .replace(/\s/g, '')
      .split('}')
      .map(i => i.split('{'))
      .slice(0, -1)
      .map(item => {
        const keys = item[1]
          .split(';')
          .filter(i => i)
          .map(line => {
            const splitedLine = line.split(HELPERS_PREFIX);

            const helpers = splitedLine.slice(1);
            helpers.push(DONE_HELPER);

            const key = splitedLine[0].split(':')[0];
            const type = splitedLine[0].split(':')[1];
            return {
              key,
              helpers,
              type: type ? type : NONE_TYPE,
            };
          });
        const currentItemFilter = keys.find(
          item => item.key === CURRENT_ITEM_KEY
        );
        const isGetAll = item[0].slice(-1) === ALL_ITEM_PREFIX;
        const typeName = isGetAll ? item[0].slice(0, -1) : item[0];
        return {
          typeName,
          isGetAll,
          keys: keys.filter(item => item.key !== CURRENT_ITEM_KEY),
          currentHelpers: currentItemFilter
            ? currentItemFilter.helpers.concat([DONE_HELPER])
            : [DONE_HELPER],
        };
      }) as SchemaTypeObje[]
  );
}

export default schemaCreator;
