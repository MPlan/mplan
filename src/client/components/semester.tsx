import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';
import { Button } from '../components/button';
import { Course } from '../components/course';

interface SemesterProps {
  semester: Model.Semester,
  onDeleteClick?: () => void,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  onCourseDeleteClick?: (course: Model.Course) => void,
}

export function Semester(props: SemesterProps) {
  const { semester } = props;
  return <View border margin padding width={15} flex={{ flexShrink: 0 }} style={{zIndex: 5}}>
    <View row justifyContent="space-between">
      <Text strong large>{semester.name}</Text>
      <Button onClick={props.onDeleteClick}>x</Button>
    </View>
    <View
      flex
      border
      margin={{ top: true }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {semester.courses.map(course => <Course
        key={course.id}
        course={course}
        onDeleteClick={() => props.onCourseDeleteClick && props.onCourseDeleteClick(course)}
      />)}
    </View>
  </View>;
}
