import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';

export interface TextProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
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

export const Text = styled<TextProps, 'span'>('span')`
  font-size: ${({ small, large, extraLarge }) => {
    const size = (small && -1) || (large && 1) || (extraLarge && 2) || 0;
    return styles.space(size);
  }};
  font-family: ${styles.fontFamily};
  font-weight: ${({ strong, light }) => {
    const fontWeight =
      (light && styles.lightTextWeight) || (strong && styles.bold) || 'normal';
    return fontWeight;
  }};
  color: ${({ color }) => {
    return color || styles.text;
  }};
`;
