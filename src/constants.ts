const NONE_TYPE = '#?:';
const CURRENT_ITEM_FILTER_KEY = '*';
const ALL_ITEM_KEY = '...';

export { CURRENT_ITEM_FILTER_KEY, ALL_ITEM_KEY, NONE_TYPE };
// TYPES
export interface SchemaType {
  key: string;
  type: string;
  helpers: string[];
}

export interface SchemaTypeObje {
  typeName: string;
  keys: SchemaType[];
  currentHelpers: string[];
}
export type HelperFunction<NodeType, ResultType, ArgsType> = (p: {
  node: NodeType;
  args: ArgsType;
  next: (node: ResultType) => any;
  baseNode: any;
}) => ResultType;

export interface HelperType<NodeType = any, ResultType = any, Args = any> {
  regex: RegExp;
  helper: HelperFunction<NodeType, ResultType, Args>;
}

export type HelperRoot = Record<string, HelperType>;
