import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

type ShadowLevels = '';

export const base = 16;
export const phi = 1.618;

export function p(x: number) { return base * Math.pow(phi, x); }
export function em(x: number) { return base * x; }

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  margin?: any,
  padding?: any,
  cursor?: any,
  hideOn?: any,
  // flex properties
  flex?: boolean | number,
  alignSelf?: any,
  justifyContent?: any,
  /** defaults to if `flexDirection === 'row' : 'wrap' : 'nowrap'` */
  flexWrap?: any,
  alignItems?: any,
  // responsive
  portion?: number, // <View portion={1/2} portion={{desk: 1/2, lap: 1, palm: 1}} />
  // quick styles
  backgroundColor?: any,
}
type S = StyledComponentClass<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, any, React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;
const computedViews = {} as { [css: string]: S }
export function View(props: ViewProps) {
  const { portion, ...restOfProps } = props;

  // if portion is present then change flex-basis

  const css = `
    display: flex;
    flex-direction: column;
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
  p?: string,
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
}
const TextDiv = styled.div`
`;
export function Text(props: TextProps) {
  return <TextDiv>{props.children}</TextDiv>
}

interface SubTextProps { }
export function SubText(props: SubTextProps) {
  return <Text />
}

interface LabelProps { }
export function Label(props: LabelProps) {
  return <Text small caps />
}