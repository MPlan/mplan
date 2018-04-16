import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Button } from './button';
import { Modal } from './modal';
import { Fa } from './fa';
import { CourseSearch } from './course-search';

const Container = styled(View)`
  flex: 1;
`;
const CourseList = styled(View)`
  flex: 1;
  margin-bottom: ${styles.space(-1)};
`;
const CourseItem = styled(View)`
  flex-direction: row;
  padding: ${styles.space(-2)} 0;
`;
const CourseItemSimpleName = styled(Text)`
  font-weight: bold;
  min-width: 6rem;
`;
const CourseItemFullName = styled(Text)``;

export interface SimpleCourseListProps {
  currentCourses: Model.Course[];
  onChangeCourses: (courses: Model.Course[]) => void;
}
export interface SimpleCourseListState {
  courseSearchOpen: boolean;
}

export class EditableCourseList extends React.Component<
  SimpleCourseListProps,
  SimpleCourseListState
> {
  constructor(props: SimpleCourseListProps) {
    super(props);
    this.state = {
      courseSearchOpen: false,
    };
  }

  handleOpenCourseSearchClick = () => {
    this.setState(previousState => ({
      ...previousState,
      courseSearchOpen: true,
    }));
  };

  handleModalBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      courseSearchOpen: false,
    }));
  };

  render() {
    return (
      <Container>
        <CourseList>
          {this.props.currentCourses.map(course => (
            <CourseItem key={course.id}>
              <CourseItemSimpleName>{course.simpleName}</CourseItemSimpleName>
              <CourseItemFullName>{course.name}</CourseItemFullName>
            </CourseItem>
          ))}
        </CourseList>
        <Button onClick={this.handleOpenCourseSearchClick}>
          <Fa icon="pencil" />
          <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
        </Button>
        <Modal
          title="Course search"
          open={this.state.courseSearchOpen}
          onBlurCancel={this.handleModalBlur}
        >
          <CourseSearch
            currentCourses={this.props.currentCourses}
            onChangeCourses={this.props.onChangeCourses}
            onCancel={this.handleModalBlur}
          />
        </Modal>
      </Container>
    );
  }
}
