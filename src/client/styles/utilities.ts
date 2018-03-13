import { base, phi } from './variables';

export function space(x: number) {
  return `${base * Math.pow(phi, x)}rem`;
}

// SHADOWS
export function boxShadow(x: number) {
  return `0 ${space(x - 1)} ${space(x)} 0 rgba(12,0,51,0.1)`;
}
