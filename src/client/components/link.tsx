import * as styles from 'styles';
import styled from 'styled-components';

import { Text } from 'components/text';

export const Link = styled(Text)`
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
