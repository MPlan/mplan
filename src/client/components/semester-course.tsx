import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';
import { DropdownMenu } from './dropdown-menu';
import { Fa } from './fa';

const Container = styled(View)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  flex-direction: row;
  &:hover {
    box-shadow: 0 0.2rem 1rem 0 rgba(12, 0, 51, 0.15);
  }
  transition: all 0.2s;
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-bottom: ${styles.space(-1)};
`;
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CriticalLevel = styled(View)``;
const Body = styled(View)`
  flex: 1;
`;

export interface SemesterCourseProps {
  course: Model.Course;
  degree: Model.Degree;
  catalog: Model.Catalog;
}

export function SemesterCourse(props: SemesterCourseProps) {
  const { course, degree, catalog } = props;
  const criticalLevel = course.criticalLevel(degree, catalog);
  return (
    <Container>
      <Body>
        <SimpleName>{course.simpleName}</SimpleName>
        <FullName>{course.name}</FullName>
        <CriticalLevel>
          {criticalLevel <= 0 ? (
            <Text>
              <Text color={styles.red}>Critical:</Text>&nbsp;take as soon as possible
            </Text>
          ) : (
            <Text>Can move ${criticalLevel} semesters.</Text>
          )}
        </CriticalLevel>
      </Body>
      <DropdownMenu
        header="fdsa"
        actions={{ one: { text: 'something', icon: 'rocket' } }}
        onAction={() => {}}
      />
    </Container>
  );
}
