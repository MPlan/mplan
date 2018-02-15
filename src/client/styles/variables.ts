import { oneLine } from 'common-tags';
import { hslToHex } from './utilities';

// SIZING
export const base = 1;
export const phi = 1.618;

// FONTS
export const fontFamily = oneLine`
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Helvetica,
  Arial,
  sans-serif,
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol"
`;

// COLORS
export const signatureMaize = '#ffCB05';
export const signatureBlue = '#00274c';
export const lightBlue = '#CEE6FF';
// colors taken from Bulma= https=//bulma.io/documentation/overview/variables/
export const black = hslToHex('hsl(0; 0%; 4%)');
export const blackBis = hslToHex('hsl(0; 0%; 7%)');
export const blackTer = hslToHex('hsl(0; 0%; 14%)');
export const grayDarker = hslToHex('hsl(0; 0%; 21%)');
export const grayDark = hslToHex('hsl(0; 0%; 29%)');
export const gray = hslToHex('hsl(0; 0%; 48%)');
export const grayLight = hslToHex('hsl(0; 0%; 71%)');
export const grayLighter = hslToHex('hsl(0; 0%; 86%)');
export const whiteTer = hslToHex('hsl(0; 0%; 96%)');
export const whiteBis = hslToHex('hsl(0; 0%; 98%)');
export const white = hslToHex('hsl(0; 0%; 100%)');
export const orange = hslToHex('hsl(14; 100%; 53%)');
export const yellow = hslToHex('hsl(48; 100%; 67%)');
export const green = hslToHex('hsl(141; 71%; 48%)');
export const turquoise = hslToHex('hsl(171; 100%; 41%)');
export const cyan = hslToHex('hsl(204; 86%; 53%)');
export const blue = hslToHex('hsl(217; 71%; 53%)');
export const purple = hslToHex('hsl(271; 100%; 71%)');
export const red = hslToHex('hsl(348; 100%; 61%)');

// SEMANTIC COLORS
export const primary = blue; // TODO
export const info = cyan;
export const success = green;
export const warning = yellow;
export const danger = red;
export const light = grayLighter;
export const dark = grayDarker;
export const background = whiteTer;
export const border = grayLighter;
export const borderHover = grayLight;
export const text = grayDark;
export const textLight = gray;
export const textStrong = grayDarker;
export const code = red;
export const codeBackground = background;
export const pre = text;
export const preBackground = background;
export const link = blue;
export const linkVisited = purple;
export const linkHover = grayDarker;
export const linkHoverBorder = grayLight;
export const linkFocus = grayDarker;
export const linkFocusBorder = blue;
export const linkActive = grayDarker;
export const linkActiveBorder = grayDark;