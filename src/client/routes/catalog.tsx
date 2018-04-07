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
const MoreCategories = styled(Text)`
  font-size: ${styles.space(-1)};
`;

export class Catalog extends Model.store.connect() {
  render() {
    const distinctSubjectCodes = this.store.catalog
      .getDistinctCategories(course => course.subjectCode)
      .toList()
      .sort();

    const firstTenSubjectCodes = distinctSubjectCodes.take(10);

    const remainingSubjectCodes = distinctSubjectCodes.count() - firstTenSubjectCodes.count();

    // this.store.catalog.getDistinctCategories
    return (
      <Container>
        <Sidebar>
          <Category>
            <CategoryHeader>Subject code</CategoryHeader>
            {firstTenSubjectCodes.map(subjectCode => (
              <CategoryItem key={subjectCode}>{subjectCode}</CategoryItem>
            ))}
            <MoreCategories>
              There are {remainingSubjectCodes} more subject codes. Click here to expand.
            </MoreCategories>
          </Category>
        </Sidebar>
        <Content>
          <Text>Content</Text>
        </Content>
      </Container>
    );
  }
}
