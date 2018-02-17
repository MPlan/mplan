import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export const Button = styled.button`
  background-color: ${styles.white};
  color: ${styles.text};
  padding: ${styles.spacing(-1)} ${styles.spacing(0)};
  border: solid ${styles.border} 0.10rem;

  & * { color: ${styles.text} !important; }

  &:hover, &:focus {
    border: solid ${styles.gray} 0.10rem;
    color: ${styles.textStrong} !important;
  }
  &:active {
    border: solid ${styles.black} 0.10rem;
    color: ${styles.textStrong} !important;
  }
  &:focus { outline: none; }
`;

