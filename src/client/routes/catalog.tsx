import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View, Text, ActionableText } from '../components';
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

export class Catalog extends Model.store.connect({
  initialState: {
    subjectCodesExpanded: false,
  },
}) {
  handleSubjectCodeMore = () => {
    this.setState(previousState => ({
      ...previousState,
      subjectCodesExpanded: true,
    }));
  };

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
            {/*if*/ !this.state.subjectCodesExpanded
              ? firstTenSubjectCodes.map(subjectCode => (
                  <CategoryItem key={subjectCode}>{subjectCode}</CategoryItem>
                ))
              : distinctSubjectCodes.map(subjectCode => (
                  <CategoryItem key={subjectCode}>{subjectCode}</CategoryItem>
                ))}
            <ActionableText onClick={this.handleSubjectCodeMore}>
              There are {remainingSubjectCodes} more subject codes. Click here to expand.
            </ActionableText>
          </Category>
        </Sidebar>
        <Content>
          <Text>Content</Text>
        </Content>
      </Container>
    );
  }
}
