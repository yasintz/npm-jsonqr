const CURRENT_ITEM_KEY = '*';
const ROOT_PREFIX = 'Root';
const ALL_ITEM_PREFIX = '$';
const HELPERS_PREFIX = '>';

const DONE_HELPER_PREFIX = '__DONE__';
const NONE_TYPE = '__NODE_TYPE__';

export {
  CURRENT_ITEM_KEY,
  NONE_TYPE,
  HELPERS_PREFIX,
  ROOT_PREFIX,
  ALL_ITEM_PREFIX,
  DONE_HELPER_PREFIX,
};
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
  isGetAll: boolean;
}
export type HelperFunction<NodeType, ResultType, ArgsType> = (p: {
  crudeNode: any;
  node: NodeType;
  args: ArgsType;
  next: (node: ResultType) => any;
  done: (node: ResultType) => any;
  baseNode: any;
}) => any;

export interface HelperType<NodeType = any, ResultType = any, Args = any> {
  regex: RegExp;
  helper: HelperFunction<NodeType, ResultType, Args>;
}

export type HelperRoot = Record<string, HelperType>;
