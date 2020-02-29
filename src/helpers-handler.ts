import deepCopy from './deep-copy';
import { HelperRoot } from './constants';

interface HelperHandlerProps {
  node: any;
  crudeNode: any;
  helperStr: string;
  next: (n: any) => any;
  done: (n: any) => any;
  baseNode: any;
  helpers: HelperRoot;
}

interface HelpersHandlerProps {
  node: any;
  baseNode: any;
  crudeNode: any;
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
  done,
  helpers,
  crudeNode,
}: HelperHandlerProps) {
  const helperObj = Object.values(helpers).find(
    helper => helperStr.matchAll(helper.regex).next().value
  );

  if (helperObj) {
    return helperObj.helper({
      node,
      crudeNode,
      args: parseArgs(helperStr, helperObj.regex),
      next,
      done,
      baseNode: deepCopy(baseNode),
    });
  }
  return next(node);
}

async function helpersHandler<T>({
  helpers,
  helperNames,
  node,
  baseNode,
  crudeNode,
}: HelpersHandlerProps) {
  return new Promise<T>(resolve => {
    if (helperNames.length === 0) {
      return node;
    }
    Array.from(helperNames)
      .reverse()
      .reduce<(n: any) => void>((next, helperStr) => {
        return refinedNode =>
          helperHandler({
            node: refinedNode,
            done: resolve,
            crudeNode,
            helperStr,
            next,
            baseNode,
            helpers,
          });
      }, resolve)(node);
  });
}

export { helpersHandler, helperHandler };
