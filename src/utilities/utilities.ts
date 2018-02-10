import * as cluster from 'cluster';
import * as colors from 'colors';
import { oneLine } from 'common-tags';

export function wait(milliseconds: number) {
  return new Promise<'TIMER'>(resolve => setTimeout(() => resolve('TIMER'), milliseconds));
}

export function getOrThrow<T>(value: T | undefined | null) {
  if (value === undefined || value === null) {
    throw new Error(`Some value was null or undefined.`);
  }
  return value;
}

export function pad(message: string, atLeast: number, padFromLeft?: boolean) {
  const amountToPad = Math.max(atLeast - message.length, 0);
  let paddedMessage = message;
  for (let i = 0; i < amountToPad; i += 1) {
    if (padFromLeft) {
      paddedMessage += ' ';
    } else {
      paddedMessage = ' ' + paddedMessage;
    }
  }
  return paddedMessage;
}

// logging stuff
function logger(level: string, color: colors.Color, ...messages: any[]) {
  if (process.env[`IGNORE_LOG_LEVEL_${level.toUpperCase()}`]) { return; }
  const colorize = /*if*/ color ? color : (s: string) => s;
  const prefix = `${colorize(oneLine`
    [${pad(level.toUpperCase().trim(), 5, true)}
    T${new Date().getTime().toString(16)}
    P${process.pid.toString(16)}]
  `)}:`;
  if (level === 'warn') {
    console.warn(prefix, ...messages);
  } else if (level === 'error') {
    console.error(prefix, ...messages);
  } else {
    console.log(prefix, ...messages);
  }
}

const _logger = {
  info: colors.blue,
  debug: colors.cyan,
  warn: colors.yellow,
  error: colors.red,
};

export const log = (Object
  .keys(_logger)
  .map(key => key as keyof typeof _logger)
  .reduce((obj, key) => {
    const color = _logger[key];

    obj[key] = (...messages: any[]) => {
      logger(key, color, ...messages);
    };
    return obj;
  }, {} as {[P in keyof typeof _logger]: (message: any) => void})
);

export function combineUniquely(arrA: string[], arrB: string[]) {
  const objA = arrA.reduce((obj, next) => {
    obj[next] = true;
    return obj;
  }, {} as { [key: string]: true });

  const objB = arrB.reduce((obj, next) => {
    obj[next] = true;
    return obj;
  }, {} as { [key: string]: true });

  const uniqueAWithNoB = Object.keys(objA).filter(a => !objB[a]);
  const uniqueB = Object.keys(objB);
  const uniqueArr = [...uniqueAWithNoB, ...uniqueB];
  return uniqueArr;
}

export function throwIfNotOne(options: { [key: string]: number | undefined }) {
  const first = Object.entries(options)[0];
  if (!first) { throw new Error(`Used 'throwIfNotOne' incorrectly.`); }
  const [key, value] = first;
  if (value !== 1) {
    throw new Error(`Expected '${key}' to be '1' but found '${value}' instead`);
  }
}

export function removeEmptyKeys<T extends { [key: string]: any }>(obj: T) {
  const newObj = (Object
    .entries(obj)
    .filter(([_, value]) => {
      if (value === undefined) { return false; }
      if (value === null) { return false; }
      return true;
    })
    .reduce((newObj, [key, value]) => {
      newObj[key] = value;
      return newObj;
    }, {} as T)
  );
  return newObj;
}

export function combineObjects<T>(...objects: any[]) {
  return objects.reduce((combined, nextObject) => ({
    ...removeEmptyKeys(combined as any),
    ...removeEmptyKeys(nextObject as any),
  }), {}) as T;
}

export async function sequentially<T, R>(list: T[], asyncFunction: (t: T) => Promise<R>) {
  const newList = [] as R[];
  for (const i of list) {
    newList.push(await asyncFunction(i));
  }
  return newList;
}

export function flatten<T>(listOfLists: T[][]) {
  return listOfLists.reduce((flattenedList, nextList) => [
    ...flattenedList,
    ...nextList
  ], [] as T[]);
}
