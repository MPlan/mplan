import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { SemesterCourse } from './semester-course';
import styled from 'styled-components';
import * as styles from '../styles';
import { Dropzone, SortChange } from './dropzone';

const Container = styled(View)`
  width: 20rem;
  max-width: 20rem;
  min-width: 20rem;
  margin-right: ${styles.space(2)};
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(0)};
  justify-content: space-between;
`;
const SemesterName = styled(Text)`
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
`;
const CourseCount = styled(Text)`
  color: ${styles.textLight};
`;
const Card = styled(View)`
  flex: 1;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(1)};
  padding-top: ${styles.space(-1)};
  overflow: auto;
`;

export interface SemesterProps {
  semester: Model.Semester;
  degree: Model.Degree;
  catalog: Model.Catalog;
}

export class Semester extends Model.store.connect({
  propsExample: (undefined as any) as SemesterProps,
}) {
  handleOnChangeSort = (e: SortChange) => {
    const { fromDropzoneId, toDropzoneId, newIndex, oldIndex } = e;
    this.setStore(store =>
      store.updatePlan(plan => {
        const semester = plan.semesterMap.get(fromDropzoneId);
        if (!semester) {
          console.warn('semester was not found when sorting');
          return plan;
        }
        const course = semester._courses.get(oldIndex);
        if (!course) {
          console.warn('course was not found when sorting');
          return plan;
        }
        return plan
          .updateSemester(fromDropzoneId, semester => {
            const newCourses = semester._courses.filter((_, index) => index !== oldIndex);
            return semester.set('_courses', newCourses);
          })
          .updateSemester(toDropzoneId, semester => {
            const newCourses = semester._courses.insert(newIndex, course);
            return semester.set('_courses', newCourses);
          });
      }),
    );
  };

  renderCourse = (course: Model.Course) => {
    return (
      <SemesterCourse
        key={course.id}
        course={course}
        degree={this.props.degree}
        catalog={this.props.catalog}
      />
    );
  };

  render() {
    const { semester, degree, catalog } = this.props;
    const courses = semester.courses;
    return (
      <Container>
        <Header>
          <SemesterName>{semester.name}</SemesterName>
          <CourseCount>
            {semester.courseCount} {semester.courseCount === 1 ? 'course' : 'courses'}
          </CourseCount>
        </Header>
        <Card>
          <Dropzone
            id={semester.id}
            elements={courses}
            getKey={course => course.id}
            onChangeSort={this.handleOnChangeSort}
            render={this.renderCourse}
          />
        </Card>
      </Container>
    );
  }
}
