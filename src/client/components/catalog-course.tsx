import * as React from 'react';
import styled from 'styled-components';
import * as Model from '../models';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';

const Container = styled(View)`
  margin-bottom: ${styles.space(0)};
`;
const Row = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  min-width: 6rem;
`;
const FullName = styled(Text)``;
const Description = styled(Text)`
  text-align: justify;
`;
const CreditHours = styled(Text)`
  margin-left: auto;
  min-width: 10rem;
`;

export interface CatalogCourseProps {
  course: Model.Course;
}

export function CatalogCourse(props: CatalogCourseProps) {
  const { course } = props;
  return (
    <Container>
      <Row>
        <SimpleName>{course.simpleName}</SimpleName>
        <FullName>{course.name}</FullName>
        <CreditHours>{course.creditHours} credit hours</CreditHours>
      </Row>
      <Description>{course.description}</Description>
    </Container>
  );
}
