import * as cluster from 'cluster';
import * as colors from 'colors';
import { oneLine } from 'common-tags';

export function wait(milliseconds: number) {
  return new Promise<'TIMER'>(resolve => setTimeout(() => resolve('TIMER')));
}

export function getOrThrow<T>(value: T | undefined | null) {
  if (value === undefined || value === null) {
    throw new Error(`Value '${value}' was null or undefined!`);
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
function loggingString(level: string, message: string, color?: colors.Color) {
  const colorize = /*if*/ color ? color : (s: string) => s;
  return `${colorize(oneLine`
    [${pad(level.toUpperCase().trim(), 6, true)}
    T${new Date().getTime().toString(16)}
    P${process.pid.toString(16)}]
  `)}: ${message}`;
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

    obj[key] = (message: string) => {
      console[key](loggingString(key, message, color));
    };
    return obj;
  }, {} as {[P in keyof typeof _logger]: (message: string) => void})
);
