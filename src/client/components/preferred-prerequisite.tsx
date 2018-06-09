import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)``;
const Header = styled(Text)`
  text-decoration: underline;
  margin-bottom: ${styles.space(-1)};
`;
const PrerequisiteList = styled.ul`
  margin: 0;
  padding: 0 0 0 ${styles.space(1)};
`;
const PrerequisiteItem = styled.li``;

export interface PreferredPrerequisiteProps {
  course: Model.Course;
  catalog: Model.Catalog;
  degree: Model.Degree;
}

export function PreferredPrerequisite(props: PreferredPrerequisiteProps) {
  const { course, catalog, degree } = props;
  return (
    <Container>
      <Header small>Preferred prerequisites:</Header>
      <PrerequisiteList>
        {course
          .bestOption()
          .map(course => (course instanceof Model.Course ? course.simpleName : course))
          .map(course => (
            <PrerequisiteItem key={course}>
              <Text small>{course}</Text>
            </PrerequisiteItem>
          ))}
      </PrerequisiteList>
    </Container>
  );
}
