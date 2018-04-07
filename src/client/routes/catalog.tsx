import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View, Text, ActionableText, Category, Filter } from '../components';
import * as styles from '../styles';
import * as Immutable from 'immutable';

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;
const Sidebar = styled(View)`
  min-width: 20rem;
  background-color: ${styles.grayLighter};
`;
const Content = styled(View)``;

export class Catalog extends Model.store.connect({
  initialState: {
    filters: Immutable.Map<string, Filter>(),
  },
}) {
  handleSubjectCodeMore = () => {
    this.setState(previousState => ({
      ...previousState,
      subjectCodesExpanded: true,
    }));
  };

  get filteredCourses() {
    return this.store.catalog.courseMap
      .valueSeq()
      .filter(course => this.state.filters.every(filter => filter.apply(course)));
  }

  handleFilterChange = (filter: Filter) => {
    this.setState(previousState => ({
      ...previousState,
      filters: previousState.filters.remove(filter.id).set(filter.id, filter),
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
          <Category
            name="Subject code"
            categoryPicker={course => course.subjectCode}
            courses={this.filteredCourses}
            onFilterChange={this.handleFilterChange}
          />
          <Category
            name="Credit hours"
            categoryPicker={course => `${course.credits}`}
            courses={this.filteredCourses}
            onFilterChange={this.handleFilterChange}
          />
        </Sidebar>
        <Content>
          <Text>Content</Text>
        </Content>
      </Container>
    );
  }
}
