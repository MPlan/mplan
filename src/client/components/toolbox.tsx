import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';

const Container = styled(View)`
  box-shadow: ${styles.boxShadow(0)};
  width: 16rem;
  background-color: ${styles.white};
  transition: all 200ms;
  max-width: 16rem;
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin: ${styles.space(0)};
`;
const Body = styled(View)`
  flex: 1;
`;

export class Toolbox extends Model.store.connect() {
  render() {
    return (
      <Container style={{ maxWidth: this.store.ui.showToolbox ? '16rem' : 0 }}>
        <Header>Toolbox</Header>
        <Body />
      </Container>
    );
  }
}
