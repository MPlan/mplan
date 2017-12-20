import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import * as Color from './colors';

type ShadowLevels = '';

export const base = 1;
export const phi = 1.618;

export function p(x: number) { return base * Math.pow(phi, x); }
export function em(x: number) { return base * x; }

interface Directions {
  all?: boolean | number,
  vertical?: boolean | number,
  horizontal?: boolean | number,
  right?: boolean | number,
  top?: boolean | number,
  left?: boolean | number,
  bottom?: boolean | number,
}

interface Flex {
  flexGrow?: number,
  flexShrink?: number,
  /** decimals are converted to percentages  */
  flexBasis?: string | number,
}


function removeBooleanFromDirections(marginOrPadding?: Directions): {
  [P in keyof Directions]: number
} {
  if (typeof marginOrPadding !== 'object') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  return (Object
    .keys(marginOrPadding)
    .map(key => ({ key, value: marginOrPadding[key as keyof typeof marginOrPadding] }))
    .map(({ key, value }) => ({
      key,
      value: (/*if*/ value === true
        ? 1
        : /*if*/ typeof value === 'number' ? value : 0
      )
    }))
    .reduce((acc, { key, value }) => {
      acc[key as keyof typeof acc] = value;
      return acc;
    }, {} as {[P in keyof Directions]: number})
  );
}

type TopRightBottomLeft = { top: number, right: number, bottom: number, left: number, }
function parseMarginOrPadding(marginOrPadding?: boolean | number | Directions): TopRightBottomLeft {
  if (marginOrPadding === true) {
    return { top: 1, right: 1, bottom: 1, left: 1 };
  }
  if (typeof marginOrPadding === 'number') {
    return {
      top: marginOrPadding, right: marginOrPadding, bottom: marginOrPadding, left: marginOrPadding
    };
  }
  if (typeof marginOrPadding === 'object') {
    const m = removeBooleanFromDirections(marginOrPadding);
    const topRightBottomLeft = { top: 0, right: 0, bottom: 0, left: 0 };
    if (typeof m.all === 'number') {
      topRightBottomLeft.top = m.all;
      topRightBottomLeft.right = m.all;
      topRightBottomLeft.bottom = m.all;
      topRightBottomLeft.left = m.all;
    }
    if (typeof m.vertical === 'number') {
      topRightBottomLeft.top = m.vertical;
      topRightBottomLeft.bottom = m.vertical
    }
    if (typeof m.horizontal === 'number') {
      topRightBottomLeft.left = m.horizontal;
      topRightBottomLeft.right = m.horizontal
    }
    if (typeof m.top === 'number') { topRightBottomLeft.top = m.top; }
    if (typeof m.right === 'number') { topRightBottomLeft.right = m.right; }
    if (typeof m.bottom === 'number') { topRightBottomLeft.bottom = m.bottom; }
    if (typeof m.left === 'number') { topRightBottomLeft.left = m.left; }
    return topRightBottomLeft;
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

type FlexGrowShrinkBasis = { flexGrow: number, flexShrink: number, flexBasis: string }
function parseFlex(flex?: boolean | number | Flex): FlexGrowShrinkBasis {
  if (flex === true) {
    return { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' };
  }
  if (typeof flex === 'number') {
    return { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' };
  }
  if (typeof flex === 'object') {
    const flexGrowShrinkBasis = { flexGrow: 0, flexShrink: 1, flexBasis: 'auto' };
    if (typeof flex.flexGrow === 'number') {
      flexGrowShrinkBasis.flexGrow = flex.flexGrow;
    }
    if (typeof flex.flexShrink === 'number') {
      flexGrowShrinkBasis.flexShrink = flex.flexShrink;
    }
    if (typeof flex.flexBasis === 'number') {
      flexGrowShrinkBasis.flexBasis = `${(flex.flexBasis * 100).toFixed(3)}%`;
    }
    if (typeof flex.flexBasis === 'string') {
      flexGrowShrinkBasis.flexBasis = flex.flexBasis;
    }
    return flexGrowShrinkBasis;
  }
  return { flexGrow: 0, flexShrink: 1, flexBasis: 'auto' };
}

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  margin?: boolean | number | Directions,
  padding?: boolean | number | Directions,
  hideOn?: any,
  // flex properties
  flex?: boolean | number | Flex,
  alignSelf?: string,
  justifyContent?: string,
  /** shorthand for `flex-direction: row` */
  row?: boolean,
  flexDirection?: string,
  /** defaults to if `flexDirection === 'row' : 'wrap' : 'nowrap'` */
  flexWrap?: string,
  alignItems?: string,
  // responsive
  // TODO
  // portion?: number, // <View portion={1/2} portion={{desk: 1/2, lap: 1, palm: 1}} />
  // quick styles
  backgroundColor?: string,
  /** width in `rem`. Do *not* use this property if the width changes dynamically */
  width?: number,
  /** height in `rem`. Do *not* use this property if the height changes dynamically */
  height?: number,
}
type ComputedView = StyledComponentClass<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, any, React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;
const computedViews = {} as { [css: string]: ComputedView }
export function View(props: ViewProps) {
  const {
    margin, padding, hideOn, flex, alignSelf, justifyContent, flexWrap, alignItems,
    /*portion,*/ row, flexDirection, backgroundColor, width, height,
    ...restOfProps
  } = props;

  const m = parseMarginOrPadding(margin);
  const p = parseMarginOrPadding(padding);
  const f = parseFlex(flex);
  const as = alignSelf || 'auto';
  const jc = justifyContent || 'flex-start';
  const ai = alignItems || 'stretch';
  const fd = /*if*/ row ? 'row' : flexDirection || 'column';
  const fw = flexWrap || /*if*/ fd === 'row' ? 'wrap' : 'nowrap';
  const bg = backgroundColor || 'initial';

  const css = `
    margin: ${m.top}rem ${m.right}rem ${m.bottom}rem ${m.left}rem;
    padding: ${p.top}rem ${p.right}rem ${p.bottom}rem ${p.left}rem;
    display: flex;
    flex-direction: ${fd};
    flex-wrap: ${fw};
    align-self: ${as};
    flex: ${f.flexGrow.toFixed(3)} ${f.flexShrink.toFixed(3)} ${f.flexBasis};
    justify-content: ${jc};
    align-items: ${ai};
    background-color: ${bg};
    ${/*if*/ width ? `width: ${width}rem;` : ''}
    ${/*if*/ height ? `height: ${width}rem;` : ''}
  `;

  if (!computedViews[css]) {
    const templateStringsArray = Object.assign([css], { raw: [css] });
    const StyledView = styled.div(templateStringsArray);
    computedViews[css] = StyledView;
    return <StyledView {...restOfProps} />
  }
  const StyledView = computedViews[css];
  return <StyledView {...restOfProps} />
}

export interface TextProps {
  children?: string,
  // sizing
  p?: number,
  small?: boolean,
  large?: boolean,
  extraLarge?: boolean,
  // color
  light?: boolean,
  dark?: boolean,
  primary?: boolean,
  info?: boolean,
  warning?: boolean,
  danger?: boolean,
  // weight
  weak?: boolean,
  strong?: boolean,
  // effects
  caps?: boolean,
  color?: string,
  margin?: boolean | number | Directions,
  padding?: boolean | number | Directions,
}

type ComputedText = StyledComponentClass<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, any, React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;
const computedTexts = {} as { [css: string]: ComputedText };
export function Text(props: TextProps) {

  const {
    margin, padding, p: pValue, small, large, extraLarge, light, dark, primary, info, warning,
    danger, weak, strong, caps, color,
    ...restOfProps
  } = props;

  const m = parseMarginOrPadding(margin);
  const pad = parseMarginOrPadding(padding);

  let fs = 1;
  if (small) { fs = p(-1); }
  if (large) { fs = p(1); }
  if (extraLarge) { fs = p(2); }
  if (pValue !== undefined) { fs = p(pValue); }

  let fw = 'normal';
  if (weak) { fw = 'lighter'; }
  if (strong) { fw = 'bold'; }

  const c = color || Color.text;

  // let color = ''
  // TODO
  const css = `
    margin: ${m.top}rem ${m.right}rem ${m.bottom}rem ${m.left}rem;
    padding: ${pad.top}rem ${pad.right}rem ${pad.bottom}rem ${pad.left}rem;
    font-size: ${fs}rem;
    font-weight: ${fw};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: ${c};
  `;

  if (!computedTexts[css]) {
    const templateStringsArray = Object.assign([css], { raw: [css] });
    const StyledText = styled.div(templateStringsArray);
    computedTexts[css] = StyledText;
    return <StyledText {...restOfProps} />
  }
  const StyledText = computedTexts[css];
  return <StyledText {...restOfProps} />
}
