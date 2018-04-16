import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Button } from './button';
import { Modal } from './modal';
import { CourseSearch } from './course-search';

const Container = styled(View)``;

export interface SimpleCourseListProps {}
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
        <Button onClick={this.handleOpenCourseSearchClick}>Open course search</Button>
        <Modal
          title="Course search"
          open={this.state.courseSearchOpen}
          onBlurCancel={this.handleModalBlur}
        >
          <CourseSearch />
        </Modal>
      </Container>
    );
  }
}
