import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { SemesterCourse } from './semester-course';
import styled from 'styled-components';
import * as styles from '../styles';
import { Dropzone, SortChange } from './dropzone';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';
import { ActionableText } from './actionable-text';

const Container = styled(View)`
  width: 16rem;
  max-width: 16rem;
  min-width: 16rem;
  margin-right: ${styles.space(2)};
  flex: 1;
  position: relative;
  .semesters-container > :not(:last-child) &::after {
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
`;
const Count = styled(Text)`
  color: ${styles.textLight};
  /* font-size: ${styles.space(-1)}; */
`;
const Card = styled(View)`
  flex: 1;
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

export interface SemesterProps {
  semester: Model.Semester;
}

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
};

export class Semester extends Model.store.connect({
  propsExample: (undefined as any) as SemesterProps,
}) {
  handleOnChangeSort = (e: SortChange) => {
    const { fromDropzoneId, toDropzoneId, newIndex, oldIndex } = e;
    this.setStore(store =>
      store.updatePlan(plan => {
        const semester = plan.semesterMap.get(fromDropzoneId);
        if (fromDropzoneId === 'unplaced-courses') {
          const course = plan.unplacedCourses()[oldIndex];
          return plan.updateSemester(toDropzoneId, semester => {
            const newCourses = semester._courseIds.insert(newIndex, course.catalogId);
            return semester.set('_courseIds', newCourses);
          });
        }
        if (!semester) {
          return plan;
        }
        const course = semester._courseIds.get(oldIndex);
        if (!course) {
          console.warn('course was not found when sorting');
          return plan;
        }
        return plan
          .updateSemester(fromDropzoneId, semester => {
            const newCourses = semester._courseIds.filter((_, index) => index !== oldIndex);
            return semester.set('_courseIds', newCourses);
          })
          .updateSemester(toDropzoneId, semester => {
            const newCourses = semester._courseIds.insert(newIndex, course);
            return semester.set('_courseIds', newCourses);
          });
      }),
    );
  };

  handleDeleteCourse(course: Model.Course) {
    this.setStore(store =>
      store.updatePlan(plan =>
        plan.updateSemester(this.props.semester.id, semester => semester.deleteCourse(course)),
      ),
    );
  }

  renderCourse = (course: Model.Course) => {
    return (
      <SemesterCourse
        key={course.id}
        course={course}
        onDeleteCourse={() => this.handleDeleteCourse(course)}
      />
    );
  };

  handleAction = (_: keyof typeof actions) => {};

  render() {
    const { semester } = this.props;
    const courses = semester.courseArray();
    const totalCredits = semester.totalCredits();
    return (
      <RightClickMenu header={semester.name} actions={actions} onAction={this.handleAction}>
        <Container className={`semester-${semester.id}`}>
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
              onChangeSort={this.handleOnChangeSort}
              render={this.renderCourse}
            />
            <AddCourse small onClick={() => {}}>
              Add course to this semester...
            </AddCourse>
          </Card>
          <Marker>
            <Circle />
            <VerticalLine />
          </Marker>
        </Container>
      </RightClickMenu>
    );
  }
}
