import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { SemesterCourse } from './semester-course';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)`
  width: 20rem;
  max-width: 20rem;
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
`;

export interface SemesterProps {
  semester: Model.Semester;
  degree: Model.Degree;
  catalog: Model.Catalog;
}

export function Semester(props: SemesterProps) {
  const { semester, degree, catalog } = props;
  return (
    <Container>
      <Header>
        <SemesterName>{semester.name}</SemesterName>
        <CourseCount>
          {semester.courseCount} {semester.courseCount === 1 ? 'course' : 'courses'}
        </CourseCount>
      </Header>
      <Card>
        {semester.courses.map(course => (
          <SemesterCourse key={course.id} course={course} degree={degree} catalog={catalog} />
        ))}
      </Card>
    </Container>
  );
}
