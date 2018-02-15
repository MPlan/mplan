import { hsl } from 'polished';
import { base, phi } from './variables';

export function size(x: number) { return base * Math.pow(phi, x); }

export function hslToHex(hslString: string) {
  const match = /hsl\((.*)(?:,|;)(.*)(?:,|;)(.*)\)/.exec(hslString);
  if (!match) {
    throw new Error('could not convert hsl string to HSL values ' + hslString);
  }
  const hue = parsePercentOrDecimal(match[1].trim());
  const saturation = parsePercentOrDecimal(match[2].trim());
  const lightness = parsePercentOrDecimal(match[3].trim());
  return hsl({ hue, saturation, lightness });
}

export function parsePercentOrDecimal(percentageOrDecimal: string) {
  const match = /([0-9.]*)%/.exec(percentageOrDecimal);
  if (!match) { return parseFloat(percentageOrDecimal); }
  const percentValue = parseFloat(match[1]);
  return percentValue / 100;
}
