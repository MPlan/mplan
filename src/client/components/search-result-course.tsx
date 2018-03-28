import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import * as Model from '../models';
import { Button } from './button';

const Container = styled(View)`
  flex-direction: row;
  margin-top: ${styles.space(0)};
  align-items: center;
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(-1)};
  min-width: 7rem;
`;
const FullName = styled(Text)`
  margin-right: auto;
`;

export interface SearchResultCourseProps {
  course: Model.Course;
  onAddCourse?: () => void;
}

export function SearchResultCourse(props: SearchResultCourseProps) {
  const { course } = props;
  return (
    <Container>
      <SimpleName>{course.simpleName}</SimpleName>
      <FullName>{course.name}</FullName>
      <Button onClick={props.onAddCourse}>+ add</Button>
    </Container>
  );
}
