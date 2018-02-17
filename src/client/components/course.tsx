import * as React from 'react';
import { View, Text } from './';
import { Button } from '../components/button';
import * as Model from '../models';
import * as Styles from '../styles';
import styled from 'styled-components';

const CourseContainer = styled(View) `
  flex-direction: row;
  border: solid ${Styles.borderWidth} ${Styles.border};
  padding: ${Styles.spacing(0)};
  margin-bottom: ${Styles.spacing(0)};
  align-items: baseline;
  background-color: ${Styles.white};
`;

export interface CourseProps {
  course: Model.Course,
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void,
}

export function Course(props: CourseProps) {
  const course = props.course;
  return <CourseContainer
    key={course._id.toHexString()}
    onMouseDown={props.onMouseDown}
  >
    <Text strong>{course.subjectCode}&nbsp;</Text>
    <Text strong>{course.courseNumber}&nbsp;</Text>
    <Text>{course.name}&nbsp;</Text>
    <Button onClick={props.onDeleteClick}>x</Button>
  </CourseContainer>;
}
