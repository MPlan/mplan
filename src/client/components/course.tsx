import * as React from 'react';
import { View, Text } from '../components/base';
import { Button } from '../components/button';
import * as Model from '../models';

export interface CourseProps {
  course: Model.Course,
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
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
  >
    <Text strong>{course.subjectCode}&nbsp;</Text>
    <Text strong>{course.courseNumber}&nbsp;</Text>
    <Text>{course.name}&nbsp;</Text>
    <Button onClick={props.onDeleteClick}>x</Button>
  </View>;
}
