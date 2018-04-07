import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View, Text } from '../components';
import * as styles from '../styles';

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;
const Sidebar = styled(View)`
  min-width: 20rem;
  background-color: ${styles.grayLighter};
`;
const Content = styled(View)``;
const Category = styled(View)`
  padding: ${styles.space(0)};
`;
const CategoryHeader = styled(Text)`
  font-weight: ${styles.bold};
`;
const CategoryItem = styled(Text)`
  margin-left: ${styles.space(0)};
`;

export class Catalog extends Model.store.connect() {
  render() {
    return <Container>
      <Sidebar>
        <Category>
          <CategoryHeader>Subject code</CategoryHeader>
          <CategoryItem>CIS</CategoryItem>
          <CategoryItem>ECE</CategoryItem>
          <CategoryItem>MATH</CategoryItem>
        </Category>
      </Sidebar>
      <Content><Text>Content</Text></Content>
    </Container>;
  }
}
