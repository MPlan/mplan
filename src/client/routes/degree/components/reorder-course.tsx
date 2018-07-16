import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)`
  flex-direction: row;
  padding: ${styles.space(0)} ${styles.space(1)};
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(-1)};
`;
const FullName = styled(Text)``;

interface ReorderCourseProps {
  course: Model.Course;
}

export function ReorderCourse({ course }: ReorderCourseProps) {
  return (
    <Container>
      <SimpleName>{course.simpleName}</SimpleName>
      <FullName>{course.name}</FullName>
    </Container>
  );
}
