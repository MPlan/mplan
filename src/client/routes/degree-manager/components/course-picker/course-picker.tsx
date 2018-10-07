import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { SortEnd } from 'react-sortable-hoc';
import { Modal } from 'components/modal';
import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { Paragraph } from 'components/paragraph';
import { Button } from 'components/button';
import { Empty } from 'components/empty';
import { Caption as _Caption } from 'components/caption';
import { Autosuggest } from 'components/autosuggest';
import { IconButton as _IconButton } from 'components/icon-button';
import { Fa } from 'components/fa';
import { createInfoModal } from 'components/info-modal';
import { SortableCourseList } from './components/sortable-course-list';
import { AutosuggestCourse } from './components/autosuggest-course';

const { getSimpleName, getCatalogId } = Model.Course;

interface ContentProps extends ViewProps {
  sorting?: boolean;
}
const Content = styled<ContentProps>(View)`
  flex: 1 1 auto;
  overflow: hidden;
  & * {
    ${props => (props.sorting ? 'user-select: none !important' : '')};
  }
  border-bottom: 1px solid ${styles.grayLighter};
`;
const Actions = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: flex-end;
  & ${Button} {
    margin-left: ${styles.space(-1)};
  }
  margin-top: ${styles.space(-1)};
`;
const RowHeader = styled(View)`
  flex-direction: row;
  flex: 0 0 auto;
  border-bottom: 1px solid ${styles.grayLighter};
  margin: 0 ${styles.space(0)};
  margin-top: ${styles.space(1)};
  align-items: flex-end;
  padding-bottom: ${styles.space(-1)};
`;
const CourseNameCell = styled(Text)`
  text-transform: uppercase;
`;
const DefaultCourse = styled(Text)`
  margin-left: auto;
  text-transform: uppercase;
  text-align: right;
  margin-right: ${styles.space(-1)};
`;
const IconButton = styled(_IconButton)`
  margin-right: 7rem;
  align-self: center;
`;

export interface CoursePickerProps {
  title: string;
  open: boolean;
  courses: Model.Course.Model[];
  presetCourses: { [catalogId: string]: true | undefined };
  searchResults: Model.Course.Model[];
  query: string;
  searchResultsCount: number;
  onSearch: (query: string) => void;
  onAdd: (catalogId: string) => void;
  onRemove: (catalogId: string) => void;
  onRearrange: (oldIndex: number, newIndex: number) => void;
  onTogglePreset: (catalogId: string) => void;
  onClose: () => void;
}

interface CoursePickerState {
  sorting: boolean;
}

export class CoursePicker extends React.PureComponent<CoursePickerProps, CoursePickerState> {
  infoModal = createInfoModal();

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

  handleSortStart = () => {
    this.setState({ sorting: true });
  };

  handleSortEnd = (sortEnd: SortEnd) => {
    this.setState({ sorting: false });
    this.props.onRearrange(sortEnd.oldIndex, sortEnd.newIndex);
  };

  handleSelectSuggestion = (catalogId: string) => {
    this.props.onAdd(catalogId);
  };

  renderSuggestion = (course: Model.Course.Model, selected: boolean) => {
    return <AutosuggestCourse course={course} selected={selected} />;
  };

  render() {
    const {
      title,
      open,
      courses,
      searchResults,
      searchResultsCount,
      presetCourses,
      onRemove,
      onClose,
      onSearch,
      onTogglePreset,
    } = this.props;

    const { sorting } = this.state;
    const InfoModal = this.infoModal.Modal;

    return (
      <>
        <Modal title={title} size="large" open={open}>
          <Content sorting={sorting}>
            <Autosuggest
              items={searchResults}
              getDisplayText={getSimpleName}
              getKey={getCatalogId}
              onSearch={onSearch}
              renderSuggestion={this.renderSuggestion}
              onSelectSuggestion={this.handleSelectSuggestion}
              placeholder="Add a course by searching here…"
              totalCount={searchResultsCount}
            />
            {courses.length > 0 ? (
              <>
                <RowHeader>
                  <CourseNameCell>Course name</CourseNameCell>
                  <DefaultCourse>
                    Add by
                    <br />
                    default
                  </DefaultCourse>
                  <IconButton onClick={this.infoModal.open}>
                    <Fa icon="questionCircle" />
                  </IconButton>
                </RowHeader>
                <SortableCourseList
                  onSortStart={this.handleSortStart}
                  onSortEnd={this.handleSortEnd}
                  courses={courses}
                  presetCourses={presetCourses}
                  onRemove={onRemove}
                  onTogglePreset={onTogglePreset}
                  helperClass="sortableHelper"
                  lockAxis="y"
                  distance={5}
                />
              </>
            ) : (
              <Empty title="Nothing here yet." subtitle="Search for a course above to begin." />
            )}
          </Content>
          <Actions>
            <Button onClick={onClose}>Done</Button>
          </Actions>
        </Modal>
        <InfoModal title="About Default courses">
          <Paragraph>
            Default courses are the pre-populated courses that appear to students in this course
            group.
          </Paragraph>
          <Paragraph>
            A student can choose to add to, remove from, or replace any of the default courses.
            Default courses can be thought of as the recommended courses a student should take to
            satisfy the requirement group.
          </Paragraph>
          <Paragraph>
            Certain requirement groups such as "Written and Oral Communication" are ideal for
            default courses because almost every student will take COMP 105 and COMP 270.
          </Paragraph>
          <Paragraph>
            Default courses aren't applicable to other requirement groups as such "Technical
            Electives" because there isn't a preset list of courses that every student should take.
          </Paragraph>
          <Text>
            The general recommendation is to set preset courses <strong>only</strong> if the
            majority of students will take these courses to satisfy the requirement.
          </Text>
        </InfoModal>
      </>
    );
  }
}
