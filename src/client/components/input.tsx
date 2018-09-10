import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  focused?: boolean;
}
export const Input = styled.input<InputProps>`
  padding: ${styles.space(-1)} ${styles.space(0)};
  font-family: ${styles.fontFamily};
  border: ${props => (props.focused ? '2px' : '1px')} solid
    ${props => (props.focused ? styles.blue : styles.grayLighter)};
  transition: all 200ms;
  outline: none;
`;
