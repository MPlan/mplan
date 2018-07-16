import * as React from 'react';
import { View } from './view';
import { Text } from './text';
import { Button } from '../components/button';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';

const CourseContainer = styled(View)`
  flex-direction: row;
  border: ${styles.border};
  padding: ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
  align-items: baseline;
  background-color: ${styles.white};
`;

export interface CourseProps {
  course: Model.Course;
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function Course(props: CourseProps) {
  const course = props.course;
  return (
    <CourseContainer key={course._id.toHexString()} onMouseDown={props.onMouseDown}>
      <Text strong>{course.subjectCode}&nbsp;</Text>
      <Text strong>{course.courseNumber}&nbsp;</Text>
      <Text>{course.name}&nbsp;</Text>
      <Button onClick={props.onDeleteClick}>x</Button>
    </CourseContainer>
  );
}
