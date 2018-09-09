import * as styles from 'styles';
import styled from 'styled-components';

export const IconButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${styles.space(1)};
  height: ${styles.space(1)};
  border-radius: 99999px;
  outline: none;
  border: none;
  margin-top: 0.2rem;
  background-color: transparent;
  cursor: pointer;
  &:hover,
  &:focus {
    color: ${styles.blue};
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 0.2;
`;
