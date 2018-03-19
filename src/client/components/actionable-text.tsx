import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { Text } from './';

export const ActionableText = styled(Text)`
  font-family: ${styles.fontFamily};
  color: ${styles.link};
  &:active {
    ${styles.linkActive};
  }
  &:hover {
    text-decoration: underline;
    ${styles.linkHover};
    cursor: pointer;
  }
`;
