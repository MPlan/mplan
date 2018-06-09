import styled from 'styled-components';
import * as styles from '../styles';

export const Button = styled.button`
  background-color: ${styles.white};
  color: ${styles.text};
  padding: ${styles.space(-1)} ${styles.space(0)};
  border: ${styles.border};

  & * {
    color: ${styles.text} !important;
  }

  &:hover,
  &:focus {
    border: ${styles.borderWidth} solid ${styles.gray};
    color: ${styles.textStrong} !important;
  }
  &:active {
    border: ${styles.borderWidth} solid ${styles.black};
    color: ${styles.textStrong} !important;
  }
  &:focus {
    outline: none;
  }
`;
