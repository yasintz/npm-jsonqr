import { helpersHandler } from './helpers-handler';
import {
  ALL_ITEM_KEY,
  SchemaTypeObje,
  HelperRoot,
  NONE_TYPE,
} from './constants';

interface GetItemsProps {
  node: any;
  schema: SchemaTypeObje;
  allSchema: SchemaTypeObje[];
  baseNode: any;
  helpers: HelperRoot;
}
function getItems({
  node,
  helpers,
  schema,
  baseNode,
  allSchema,
}: GetItemsProps): any {
  if (
    typeof node !== 'object' ||
    schema.keys.find(item => item.key === ALL_ITEM_KEY)
  ) {
    return helpersHandler({
      node,
      helperNames: schema.currentHelpers,
      baseNode,
      helpers,
    });
  }
  if (Array.isArray(node)) {
    return helpersHandler({
      helpers,
      helperNames: schema.currentHelpers,
      baseNode,
      node: node.map(item =>
        getItems({ node: item, schema, allSchema, baseNode, helpers })
      ),
    });
  }

  const rootObje: any = {};
  schema.keys.forEach(schemaItem => {
    const childNode = node[schemaItem.key];
    if (typeof node !== 'object' || schemaItem.type === NONE_TYPE) {
      rootObje[schemaItem.key] = helpersHandler({
        node: childNode,
        helperNames: schemaItem.helpers,
        baseNode,
        helpers,
      });
    } else {
      const currentType = allSchema.find(
        ({ typeName }) => schemaItem.type === typeName
      );
      if (currentType) {
        rootObje[schemaItem.key] = helpersHandler({
          baseNode,
          helpers,
          helperNames: schemaItem.helpers,
          node: getItems({
            allSchema,
            node: childNode,
            baseNode,
            helpers,
            schema: currentType,
          }),
        });
      } else {
        rootObje[schemaItem.key] = null;
      }
    }
  });
  return helpersHandler({
    node: rootObje,
    helpers,
    helperNames: schema.currentHelpers,
    baseNode,
  });
}

export default getItems;
