import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import classNames from 'classnames';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Dropzone, SortChange } from 'components/dropzone';
import { DropdownMenu } from 'components/dropdown-menu';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';
import { ActionableText } from 'components/actionable-text';
import { CourseSearch } from 'components/course-search';

import { Course } from '../course';

const Container = styled(View)`
  width: 16rem;
  max-width: 16rem;
  min-width: 16rem;
  margin-right: ${styles.space(2)};
  flex: 1 1 auto;
  position: relative;
  &::after {
    content: ' ';
    width: calc(100% + ${styles.space(2)} + ${styles.space(-1)});
    height: ${styles.space(-1)};
    background-color: ${styles.blue};
    left: calc(50% - ${styles.space(-1)} / 2);
    bottom: 0;
    position: absolute;
    box-shadow: ${styles.boxShadow(1)};
  }
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(0)};
  justify-content: space-between;
`;
const SemesterName = styled(Text)`
  color: ${styles.textLight};
  font-weight: bold;
  margin-right: ${styles.space(0)};
  text-transform: capitalize;
`;
const Count = styled(Text)`
  color: ${styles.textLight};
  /* font-size: ${styles.space(-1)}; */
`;
const Card = styled(View)`
  flex: 1 1 auto;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(1)};
  padding-top: ${styles.space(-1)};
  overflow: auto;
  padding-bottom: 1.2rem;
`;
const Row = styled(View)`
  flex-direction: row;
`;
const AddCourse = styled(ActionableText)`
  margin: ${styles.space(0)};
`;
const Marker = styled.div`
  height: 3rem;
  position: relative;
`;
const VerticalLine = styled.div`
  position: absolute;
  background-color: ${styles.blue};
  width: ${styles.space(-1)};
  height: ${styles.space(2)};
  left: 50%;
  transform: translateX(-50%);
  box-shadow: ${styles.boxShadow(1)};
`;
const Circle = styled.div`
  position: absolute;
  width: ${styles.space(2)};
  height: ${styles.space(2)};
  border-radius: 999999px;
  background-color: ${styles.blue};
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: ${styles.boxShadow(1)};
`;

const actions = {
  add: {
    text: 'Add course',
    icon: 'plus',
    color: styles.blue,
  },
  clear: {
    text: 'Clear courses',
    icon: 'times',
  },
  delete: {
    text: 'Delete semester',
    icon: 'trash',
    color: styles.red,
  },
  reorder: {
    text: 'Reorder',
    icon: 'bars',
  },
};

export interface SemesterProps {
  semester: Model.Semester;
  onSortEnd: (e: SortChange) => void;
  onDeleteCourse: (course: Model.Course) => void;
  onAddCourses: (course: Model.Course[]) => void;
  onClearCourses: () => void;
  onDeleteSelf: () => void;
  onReorder: () => void;
}

export interface SemesterState {
  coursePickerOpen: boolean;
}

export class Semester extends React.PureComponent<SemesterProps, SemesterState> {
  constructor(props: SemesterProps) {
    super(props);

    this.state = {
      coursePickerOpen: false,
    };
  }

  renderCourse = (course: Model.Course) => {
    return (
      <Course
        key={course.id}
        course={course}
        onDeleteCourse={() => this.props.onDeleteCourse(course)}
      />
    );
  };

  handleAction = (action: keyof typeof actions) => {
    if (action === 'add') {
      this.handleOpenCoursePicker();
      return;
    }
    if (action === 'clear') {
      this.props.onClearCourses();
      return;
    }
    if (action === 'delete') {
      this.props.onDeleteSelf();
      return;
    }
    if (action === 'reorder') {
      this.props.onReorder();
    }
  };

  handleOpenCoursePicker = () => {
    this.setState(previousState => ({
      ...previousState,
      coursePickerOpen: true,
    }));
  };

  handleCloseCoursePicker = () => {
    this.setState(previousState => ({
      ...previousState,
      coursePickerOpen: false,
    }));
  };

  handleSaveCourses = (courses: Model.Course[]) => {
    this.handleCloseCoursePicker();
    this.props.onAddCourses(courses);
  };

  renderRightClickMenu = (rightClickProps: RightClickProps) => {
    const { semester } = this.props;
    const courses = semester.courseArray();
    const totalCredits = semester.totalCredits();

    return (
      <Container
        {...rightClickProps}
        className={classNames(`semester-${semester.id}`, rightClickProps.className)}
      >
        <Header>
          <View>
            <SemesterName>{semester.name}</SemesterName>
            <Row>
              <Count>
                {semester.courseCount} {semester.courseCount === 1 ? 'course' : 'courses'}
              </Count>
              <Count>&nbsp;|&nbsp;</Count>
              <Count>
                {totalCredits} {totalCredits === 1 ? 'credit' : 'credits'}
              </Count>
            </Row>
          </View>
          <DropdownMenu header={semester.name} actions={actions} onAction={this.handleAction} />
        </Header>
        <Card>
          <Dropzone
            id={semester.id}
            elements={courses}
            getKey={course => course.id}
            onChangeSort={this.props.onSortEnd}
            render={this.renderCourse}
          />
          <AddCourse small onClick={this.handleOpenCoursePicker}>
            Add course to this semester...
          </AddCourse>
        </Card>
        <Marker>
          <Circle />
          <VerticalLine />
        </Marker>
        <CourseSearch
          title={`Editing courses in ${semester.name}`}
          defaultCourses={semester.courseArray()}
          onCancel={this.handleCloseCoursePicker}
          open={this.state.coursePickerOpen}
          onSaveCourses={this.handleSaveCourses}
        />
      </Container>
    );
  };

  render() {
    return (
      <RightClickMenu
        header={this.props.semester.name}
        actions={actions}
        onAction={this.handleAction}
        render={this.renderRightClickMenu}
      />
    );
  }
}
