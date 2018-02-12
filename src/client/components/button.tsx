import * as React from 'react';
import { View, Text, p } from './base';
import styled from 'styled-components';
import * as Styles from './styles';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export const Button = styled.button`
  background-color: ${Styles.white};
  color: ${Styles.text};
  padding: ${p(-1)}rem ${p(0)}rem;
  border: solid ${Styles.border} 0.10rem;

  & * { color: ${Styles.text} !important; }

  &:hover, &:focus {
    border: solid ${Styles.gray} 0.10rem;
    color: ${Styles.textStrong} !important;
  }
  &:active {
    border: solid ${Styles.black} 0.10rem;
    color: ${Styles.textStrong} !important;
  }
  &:focus { outline: none; }
`;

