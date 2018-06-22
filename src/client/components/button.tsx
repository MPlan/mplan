import styled from 'styled-components';
import * as styles from '../styles';

export const Button = styled.button`
  color: ${styles.text};
  padding: ${styles.space(-1)} ${styles.space(0)};
  text-transform: uppercase;
  background-color: ${styles.whiteTer};
  border: none;
  outline: none;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${styles.fontFamily};

  & * {
    color: ${styles.text} !important;
  }

  &:hover,
  &:focus {
    color: ${styles.textStrong} !important;
    background-color: ${styles.grayLighter};
  }
  &:active {
    color: ${styles.textStrong} !important;
    background-color: ${styles.grayLight};
  }
`;
