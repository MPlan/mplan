import * as styles from 'styles';
import styled from 'styled-components';

export const VerticalBar = styled.div`
  flex: 0 0 auto;
  border-right: 1px solid ${styles.grayLight};
  width: 2px;
  margin-right: ${styles.space(0)};
  align-self: stretch;
`;
