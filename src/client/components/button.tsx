import * as React from 'react';
import { View, Text, p } from './base';
import styled from 'styled-components';
import * as Styles from './styles';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export const Button = styled.button`
  background-color: ${Styles.grayLight};
  color: ${Styles.whiteBis};
  padding: ${p(-1)}rem ${p(0)}rem;
  border: none;
  border-radius: 99999px;

  & * { color: ${Styles.whiteBis} !important; }

  &:hover, &:focus { background-color: ${Styles.gray}; }
  &:active { background-color: ${Styles.grayDark}; }
  &:focus { outline: none; }
`;

