import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View, Text } from './';
import { Prerequisite } from './prerequisite';

const CourseContainer = styled(View)`
  padding: ${styles.space(0)};
  /* border-bottom: ${styles.border}; */
`;

const CourseHeader = styled(View)`
  margin-bottom: ${styles.space(-1)};
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const CriticalInfo = styled(View)`
  margin-bottom: ${styles.space(-1)};
`;

interface CourseWithPrerequisitesProps {
  course: string | Model.Course;
  criticalLevel: number;
}

export function CourseWithPrerequisites({ course, criticalLevel }: CourseWithPrerequisitesProps) {
  const courseName = /*if*/ course instanceof Model.Course ? course.simpleName : course;

  if (typeof course === 'string') {
    return (
      <CourseContainer>
        <Text>{courseName}</Text>
      </CourseContainer>
    );
  }

  return (
    <CourseContainer>
      <CourseHeader>
        <Text strong>{courseName}</Text>
        <Text>{course.name}</Text>
      </CourseHeader>
      <CriticalInfo>
        {/*if*/ criticalLevel > 0 ? (
          <Text small>Can be moved up {criticalLevel} levels.</Text>
        ) : (
          <Text small>
            <Text small strong color={styles.red}>
              Critical:
            </Text>{' '}
            delaying this course will delay graduation.
          </Text>
        )}
      </CriticalInfo>
      {/*if*/ course.prerequisites ? (
        <Text small strong>
          Prerequisites:
        </Text>
      ) : null}
      <Prerequisite prerequisite={course.prerequisites} />
    </CourseContainer>
  );
}
