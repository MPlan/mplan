import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Accordion } from './accordion';
import { SemesterCourse } from './semester-course';
import { Dropzone, SortChange } from './dropzone';

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
const Warning = styled(View)`
  padding: ${styles.space(-1)};
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

  handleChangeSort = (e: SortChange) => {
    const { fromDropzoneId, toDropzoneId, newIndex, oldIndex } = e;
    this.setStore(store =>
      store.updatePlan(plan => {
        const semester = plan.semesterMap.get(fromDropzoneId);
        if (fromDropzoneId === 'unplaced-courses') {
          return plan;
        }
        if (!semester) {
          return plan;
        }
        return plan.updateSemester(fromDropzoneId, semester => {
          const newCourses = semester._courseIds.filter((_, index) => index !== oldIndex);
          return semester.set('_courseIds', newCourses);
        });
      }),
    );
  };

  renderCourse = (course: Model.Course) => {
    return <SemesterCourse key={course.id} course={course} />;
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
              elements={plan.unplacedCourses()}
              getKey={course => course.id}
              onChangeSort={this.handleChangeSort}
              render={this.renderCourse}
            />
          </Accordion>
          <Accordion
            header="Warnings"
            onToggle={this.handleWarningsToggle}
            open={this.state.warningsOpen}
          >
            {plan.warningsNotOfferedDuringSeason().map(warning => (
              <Warning key={warning}>
                <Text>{warning}</Text>
              </Warning>
            ))}
          </Accordion>
        </Body>
      </Container>
    );
  }
}
