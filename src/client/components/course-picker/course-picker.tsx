import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { memoizeLast } from 'utilities/memoize-last';

import { Modal } from 'components/modal';
import { View } from 'components/view';
import { Input } from 'components/input';
import { SortableCourseList } from './components/course-list';

const Content = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
  flex-direction: row;
`;
const Spacer = styled.div`
  flex: 0 0 auto;
  width: ${styles.space(0)};
`;
const Column = styled(View)`
  flex: 1 1 auto;
`;
const Search = styled(Input)``;

export interface CoursePickerProps {
  title: string;
  open: boolean;
  courses: Model.Course.Model[];
  searchResults: Model.Course.Model[];
  onSearch: (query: string) => void;
  onAdd: (catalogId: string) => void;
  onRemove: (catalogId: string) => void;
  onRearrange: (oldIndex: number, newIndex: number) => void;
}

export class CoursePicker extends React.PureComponent<CoursePickerProps, {}> {
  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.props.onSearch(value);
  };

  get addedCourses() {
    return this._addedCourses(this.props.courses);
  }
  _addedCourses = memoizeLast((courses: Model.Course.Model[]) => {
    return courses.map(Model.Course.getCatalogId).reduce(
      (set, nextId) => {
        set[nextId] = true;
        return set;
      },
      {} as { [catalogId: string]: true | undefined },
    );
  });

  render() {
    const { title, open, courses, searchResults, onAdd, onRemove, onRearrange } = this.props;

    return (
      <Modal title={title} size="extra-large" open={open}>
        <Content>
          <Column>
            <Search type="search" placeholder="Search for a course…" onChange={this.handleSearch} />
            <SortableCourseList
              disableSorting
              courses={searchResults}
              addedCourses={this.addedCourses}
              onAdd={onAdd}
              onRemove={onRemove}
              helperClass="sortableHelper"
            />
          </Column>
          <Spacer />
          <Column>
            <SortableCourseList
              courses={courses}
              addedCourses={this.addedCourses}
              onAdd={onAdd}
              onRemove={onRemove}
              onRearrange={onRearrange}
              helperClass="sortableHelper"
            />
          </Column>
        </Content>
      </Modal>
    );
  }
}
