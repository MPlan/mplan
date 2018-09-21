import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';
import { memoizeLast } from 'utilities/memoize-last';

import { Modal } from 'components/modal';
import { View, ViewProps } from 'components/view';
import { Input } from 'components/input';
import { Button, PrimaryButton } from 'components/button';
import { Empty } from 'components/empty';
import { Caption as _Caption } from 'components/caption';
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
const Actions = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: flex-end;
  & ${Button} {
    margin-left: ${styles.space(-1)};
  }
  margin-top: ${styles.space(-1)};
`;
const Caption = styled(_Caption)`
  margin-top: ${styles.space(-1)};
  border-top: 1px solid ${styles.grayLighter};
`;

export interface CoursePickerProps {
  title: string;
  open: boolean;
  courses: Model.Course.Model[];
  searchResults: Model.Course.Model[];
  query: string;
  searchResultsCount: number;
  onSearch: (query: string) => void;
  onAdd: (catalogId: string) => void;
  onRemove: (catalogId: string) => void;
  onRearrange: (oldIndex: number, newIndex: number) => void;
  onClose: () => void;
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
    const {
      title,
      open,
      courses,
      searchResults,
      searchResultsCount,
      query,
      onAdd,
      onRemove,
      onRearrange,
      onClose,
    } = this.props;

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
              empty={
                query.length > 0 ? (
                  <Empty title="Oh no!" subtitle={`We couldn't find anything for "${query}."`} />
                ) : (
                  <Empty title="Search above to get started…" />
                )
              }
            />
            <Caption>
              Showing {searchResults.length} of {searchResultsCount}{' '}
              {pluralize('result', searchResultsCount)}.{' '}
              {searchResults.length !== searchResultsCount ? 'Refine your search to see more.' : ''}
            </Caption>
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
        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton>Save</PrimaryButton>
        </Actions>
      </Modal>
    );
  }
}
