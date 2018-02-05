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
