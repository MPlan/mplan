import { base, phi } from './variables';
import { darken } from 'polished';

export function space(x: number) {
  return `${base * Math.pow(phi, x)}rem`;
}

// SHADOWS
export function boxShadow(x: number) {
  return `0 ${space(x - 1)} ${space(x)} 0 rgba(12,0,51,0.1)`;
}

export function textShadow(x: number) {
  return `0 ${space(x - 1)} ${space(x)} rgba(12,0,51,0.1)`;
}

export function hover(color: string) {
  return darken(0.1, color);
}

export function active(color: string) {
  return darken(0.2, color);
}
