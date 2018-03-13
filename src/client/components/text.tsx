import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import * as styles from '../styles';

export interface TextProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  children?: any;
  // sizing
  small?: boolean;
  large?: boolean;
  extraLarge?: boolean;
  // weight
  light?: boolean;
  strong?: boolean;
  color?: string;
}

const textCache = {} as {
  [css: string]:
    | undefined
    | StyledComponentClass<
        React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLSpanElement>,
          HTMLSpanElement
        >,
        any,
        React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLSpanElement>,
          HTMLSpanElement
        >
      >;
};

const StyledSpan = styled.span`
  font-weight: 300;
`;

export function Text(props: TextProps) {
  const {
    small,
    large,
    extraLarge,
    light,
    strong,
    color,
    ref,
    ...restOfProps
  } = props;

  const size = (small && -1) || (large && 1) || (extraLarge && 2) || 0;
  const fontWeight =
    (light && styles.lightTextWeight) || (strong && styles.bold) || undefined;

  const css = `
    font-size: ${styles.space(size)};
    font-family: ${styles.fontFamily};
    ${/*if*/ fontWeight ? `font-weight: ${fontWeight};` : ''}
    ${/*if*/ color ? `color: ${color};` : ''}

  `;

  const MaybeStyledSpan = textCache[css];
  if (!MaybeStyledSpan) {
    textCache[css] = styled.span`
      ${css};
    `;
  }
  const StyledSpan = textCache[css]!;

  return (
    <StyledSpan
      innerRef={element => {
        if (typeof ref === 'function') {
          ref(element);
        }
      }}
      {...restOfProps}
    />
  );
}
