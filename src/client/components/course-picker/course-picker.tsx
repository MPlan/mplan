import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { memoizeLast } from 'utilities/memoize-last';

import { Modal } from 'components/modal';
import { View, ViewProps } from 'components/view';
import { Input } from 'components/input';
import { SortableCourseList } from './components/sortable-course-list';
import { CourseList } from './components/course-list';

interface ContentProps extends ViewProps {
  sorting?: boolean;
}
const Content = styled<ContentProps>(View)`
  flex: 1 1 auto;
  overflow: hidden;
  flex-direction: row;
  & * {
    ${props => (props.sorting ? 'user-select: none !important' : '')};
  }
`;
const Spacer = styled.div`
  flex: 0 0 auto;
  width: ${styles.space(0)};
`;
const Column = styled(View)`
  flex: 1 1 calc(50% - 0.5rem);
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

interface CoursePickerState {
  sorting: boolean;
}

export class CoursePicker extends React.PureComponent<CoursePickerProps, CoursePickerState> {
  constructor(props: CoursePickerProps) {
    super(props);
    this.state = {
      sorting: false,
    };
  }

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

  handleSortStart = () => {
    this.setState({ sorting: true });
  };

  handleSortEnd = () => {
    this.setState({ sorting: false });
  };

  render() {
    const { title, open, courses, searchResults, onAdd, onRemove, onRearrange } = this.props;
    const { sorting } = this.state;

    return (
      <Modal title={title} size="large" open={open}>
        <Content sorting={sorting}>
          <Column>
            <Search type="search" placeholder="Search for a course…" onChange={this.handleSearch} />
            <CourseList
              courses={searchResults}
              addedCourses={this.addedCourses}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          </Column>
          <Spacer />
          <Column>
            <SortableCourseList
              onSortStart={this.handleSortStart}
              onSortEnd={this.handleSortEnd}
              courses={courses}
              addedCourses={this.addedCourses}
              onAdd={onAdd}
              onRemove={onRemove}
              onRearrange={onRearrange}
              helperClass="sortableHelper"
              lockAxis="y"
            />
          </Column>
        </Content>
      </Modal>
    );
  }
}
