import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { Text } from './';

export const ActionableText = styled(Text)`
  font-family: ${styles.fontFamily};
  color: ${styles.link};
  text-decoration: underline;
  &:active {
    ${styles.linkActive};
  }
  &:hover {
    ${styles.linkHover};
    cursor: pointer;
  }
`;
