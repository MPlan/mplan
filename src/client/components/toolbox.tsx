import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Accordion } from './accordion';
import { SemesterCourse } from './semester-course';
import { Dropzone } from './dropzone';

const Container = styled(View)`
  box-shadow: ${styles.boxShadow(0)};
  width: 16rem;
  background-color: ${styles.white};
  transition: all 200ms;
  max-width: 16rem;
  z-index: 2;
  overflow: hidden;
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin: ${styles.space(0)};
`;
const Body = styled(View)`
  flex: 1;
`;

export class Toolbox extends Model.store.connect({
  initialState: {
    unplacedCoursesOpen: true,
    warningsOpen: false,
  },
}) {
  handleUnplacedCoursesToggle = () => {
    this.setState(previousState => ({
      ...previousState,
      unplacedCoursesOpen: !previousState.unplacedCoursesOpen,
    }));
  };

  handleWarningsToggle = () => {
    this.setState(previousState => ({
      ...previousState,
      warningsOpen: !previousState.warningsOpen,
    }));
  };

  handleDeleteCourse(course: Model.Course) {}

  renderCourse = (course: Model.Course) => {
    return (
      <SemesterCourse
        key={course.id}
        course={course}
        degree={this.store.user.degree}
        catalog={this.store.catalog}
        onDeleteCourse={() => this.handleDeleteCourse(course)}
      />
    );
  };

  render() {
    const degree = this.store.user.degree;
    const plan = this.store.user.plan;
    const catalog = this.store.catalog;
    return (
      <Container style={{ maxWidth: this.store.ui.showToolbox ? '16rem' : 0 }}>
        <Header>Toolbox</Header>
        <Body>
          <Accordion
            header="Unplaced courses"
            onToggle={this.handleUnplacedCoursesToggle}
            open={this.state.unplacedCoursesOpen}
          >
            <Dropzone
              id={'unplaced-courses'}
              elements={plan
                .unplacedCourses(degree, catalog)}
              getKey={course => course.id}
              onChangeSort={() => {}}
              render={this.renderCourse}
            />
          </Accordion>
          <Accordion
            header="Warnings"
            onToggle={this.handleWarningsToggle}
            open={this.state.warningsOpen}
          >
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
          </Accordion>
        </Body>
      </Container>
    );
  }
}
