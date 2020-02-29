import deepCopy from './deep-copy';
import { HelperRoot } from './constants';

interface HelperHandlerProps {
  node: any;
  helperStr: string;
  next: (n: any) => any;
  baseNode: any;
  helpers: HelperRoot;
}

interface HelpersHandlerProps {
  node: any;
  baseNode: any;
  helpers: HelperRoot;
  helperNames: string[];
}

function parseArgs(helperString: string, regex: RegExp) {
  const args = helperString
    .matchAll(regex)
    .next()
    .value[1].split(',') as string[];

  return args;
}

function helperHandler({
  baseNode,
  helperStr,
  next,
  node,
  helpers,
}: HelperHandlerProps) {
  const helperObj = Object.values(helpers).find(
    helper => helperStr.matchAll(helper.regex).next().value
  );

  if (helperObj) {
    return helperObj.helper({
      node,
      args: parseArgs(helperStr, helperObj.regex),
      next,
      baseNode: deepCopy(baseNode),
    });
  }
  return next(node);
}

function helpersHandler({
  helpers,
  helperNames,
  node,
  baseNode,
}: HelpersHandlerProps) {
  if (helperNames.length === 0) {
    return node;
  }
  return Array.from(helperNames)
    .reverse()
    .reduce<(n: any) => void>(
      (next, helperStr) => {
        return refinedNode =>
          helperHandler({
            node: refinedNode,
            helperStr,
            next,
            baseNode,
            helpers,
          });
      },
      n => n
    )(node);
}

export { helpersHandler, helperHandler };
