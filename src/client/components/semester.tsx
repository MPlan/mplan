import * as React from 'react';
import { View, Text, Button, Course } from './';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';

const SemesterContainer = styled(View) `
  border: ${styles.border};
  margin: ${styles.spacing(0)};
  padding: ${styles.spacing(0)};
  width: 15rem;
  z-index: 5;
  flex-shrink: 0;
`;

const SemesterHeader = styled(View) `
  flex-direction: row;
  justify-content: space-between;
`;

const SemesterBody = styled(View) `
  flex: 1;
  border: ${styles.border};
  margin-top: ${styles.spacing(0)};
`;

interface SemesterProps {
  semester: Model.Semester,
  onDeleteClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  onCourseDeleteClick?: (course: Model.Course) => void,
  onCourseMouseDown?: (course: Model.Course) => void,
}

export function Semester(props: SemesterProps) {
  const { semester } = props;
  return <SemesterContainer>
    <SemesterHeader>
      <Text strong large>{semester.name}</Text>
      <Button onClick={props.onDeleteClick}>x</Button>
    </SemesterHeader>
    <SemesterBody
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {semester.courses.map(course => <Course
        key={course.id}
        course={course}
        onDeleteClick={() => props.onCourseDeleteClick && props.onCourseDeleteClick(course)}
        onMouseDown={() => props.onCourseMouseDown && props.onCourseMouseDown(course)}
      />)}
    </SemesterBody>
  </SemesterContainer>;
}
