import getItems from './get-items';
import { HelperRoot, HelperFunction } from './constants';
import deepCopy from './deep-copy';
import schemaCreator from './schema-creator';

function JsonQr<Node = any>() {
  const baseHelpers: HelperRoot = {};

  function parse(node: any, schema: string) {
    const options = { rootPrefix: '@' };
    if (typeof node !== 'object' || typeof node === 'undefined' || !node) {
      return node;
    }
    const schemaArray = schemaCreator(schema);
    const rootTypeIndex = schemaArray.findIndex(
      item => item.typeName === options.rootPrefix
    );

    if (rootTypeIndex === -1) {
      return node;
    }

    const rootType = schemaArray[rootTypeIndex];
    const copyNode = deepCopy(node);

    return getItems({
      node: copyNode,
      schema: rootType,
      allSchema: schemaArray,
      baseNode: copyNode,
      helpers: baseHelpers,
    });
  }

  function registerHelper<Result = any, Args = any>(
    helperName: string,
    fn: HelperFunction<Node, Result, Args>
  ) {
    baseHelpers[helperName] = {
      regex: new RegExp(`${helperName}\\((.*)\\\)`, 'g'),
      helper: fn,
    };
  }

  return { parse, registerHelper };
}
export default JsonQr;
