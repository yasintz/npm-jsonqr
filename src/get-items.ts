import { helpersHandler } from './helpers-handler';
import { SchemaTypeObje, HelperRoot, NONE_TYPE } from './constants';

interface GetItemsProps {
  node: any;
  schema: SchemaTypeObje;
  allSchema: SchemaTypeObje[];
  baseNode: any;
  helpers: HelperRoot;
}

async function getItems<T>({
  node,
  helpers,
  schema,
  baseNode,
  allSchema,
}: GetItemsProps): Promise<T> {
  if (typeof node !== 'object' || schema.isGetAll) {
    return helpersHandler<T>({
      node,
      crudeNode: node,
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
      crudeNode: node,
      node: await Promise.all(
        node.map(item =>
          getItems({ node: item, schema, allSchema, baseNode, helpers })
        )
      ),
    });
  }

  const rootObje: any = {};
  await Promise.all(
    schema.keys.map(async schemaItem => {
      const childNode = node[schemaItem.key];
      if (typeof node !== 'object' || schemaItem.type === NONE_TYPE) {
        rootObje[schemaItem.key] = await helpersHandler({
          node: childNode,
          crudeNode: childNode,
          helperNames: schemaItem.helpers,
          baseNode,
          helpers,
        });
        return;
      }

      const currentType = allSchema.find(
        ({ typeName }) => schemaItem.type === typeName
      );
      if (currentType) {
        rootObje[schemaItem.key] = await helpersHandler({
          baseNode,
          crudeNode: childNode,
          helpers,
          helperNames: schemaItem.helpers,
          node: await getItems({
            allSchema,
            node: childNode,
            baseNode,
            helpers,
            schema: currentType,
          }),
        });
      }
    })
  );

  return helpersHandler({
    node: rootObje,
    crudeNode: node,
    helpers,
    helperNames: schema.currentHelpers,
    baseNode,
  });
}

export default getItems;
