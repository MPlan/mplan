import * as React from 'react';
import { View, Text } from '../components/base';
import { Button } from '../components/button';
import * as Model from '../models';
import * as Styles from './styles';

export interface CourseProps {
  course: Model.Course,
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void,
}

export function Course(props: CourseProps) {
  const course = props.course;
  return <View
    key={course._id.toHexString()}
    row
    alignItems="baseline"
    border
    padding
    margin={{ bottom: true }}
    onMouseDown={props.onMouseDown}
    backgroundColor={Styles.white}
  >
    <Text strong>{course.subjectCode}&nbsp;</Text>
    <Text strong>{course.courseNumber}&nbsp;</Text>
    <Text>{course.name}&nbsp;</Text>
    <Button onClick={props.onDeleteClick}>x</Button>
  </View>;
}
