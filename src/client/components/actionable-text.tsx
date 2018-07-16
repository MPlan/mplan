import styled from 'styled-components';
import * as styles from '../styles';
import { Text } from './text';

export const ActionableText = styled(Text)`
  font-family: ${styles.fontFamily};
  color: ${styles.link};
  &:active {
    color: ${styles.linkActive};
  }
  &:hover {
    text-decoration: underline;
    ${styles.linkHover};
    cursor: pointer;
  }
`;
