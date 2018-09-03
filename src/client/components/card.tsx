import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';

export const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
`;
