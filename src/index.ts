import getItems from './get-items';
import {
  HelperRoot,
  HelperFunction,
  ROOT_PREFIX,
  DONE_HELPER_PREFIX,
} from './constants';
import deepCopy from './deep-copy';
import schemaCreator from './schema-creator';

function JsonQr<Node = any>() {
  const baseHelpers: HelperRoot = {};

  async function parse<ResultType = any>(
    node: Node,
    schema: string
  ): Promise<ResultType | Node> {
    if (typeof node !== 'object' || typeof node === 'undefined' || !node) {
      return node;
    }

    const schemaArray = schemaCreator(schema);
    const rootTypeIndex = schemaArray.findIndex(
      item => item.typeName === ROOT_PREFIX
    );

    if (rootTypeIndex === -1) {
      return node;
    }

    const rootType = schemaArray[rootTypeIndex];
    const copyNode = deepCopy(node);

    return getItems<ResultType>({
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

  registerHelper(DONE_HELPER_PREFIX, props => props.next(props.node));

  return { parse, registerHelper };
}
export default JsonQr;
