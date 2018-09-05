import styled from 'styled-components';
import * as styles from 'styles';
import { darken } from 'polished';

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

export const DangerButton = styled(Button)`
  color: ${styles.whiteTer};
  background-color: ${styles.danger};
  & * {
    color: ${styles.whiteTer} !important;
  }

  &:hover,
  &:focus {
    color: ${styles.white} !important;
    background-color: ${darken(0.1, styles.danger)};
  }

  &:active {
    color: ${styles.white} !important;
    background-color: ${darken(0.2, styles.danger)};
  }
`;

export const PrimaryButton = styled(Button)`
  color: ${styles.whiteTer};
  background-color: ${styles.blue};
  & * {
    color: ${styles.whiteTer} !important;
  }

  &:hover,
  &:focus {
    color: ${styles.white} !important;
    background-color: ${darken(0.1, styles.blue)};
  }

  &:active {
    color: ${styles.white} !important;
    background-color: ${darken(0.2, styles.blue)};
  }
`;

export const TransparentButton = styled(Button)`
  background-color: transparent;
`;
