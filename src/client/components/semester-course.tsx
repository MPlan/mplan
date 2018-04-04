import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';
import { DropdownMenu } from './dropdown-menu';
import { Fa } from './fa';
import { PreferredPrerequisite } from './preferred-prerequisite';
import { Draggable } from './draggable';

const Container = styled(View)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  flex-direction: row;
  position: relative;
  &:hover {
    box-shadow: 0 0.2rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  background-color: ${styles.white};
  &:active {
    box-shadow: 0 0.4rem 1.3rem 0 rgba(12, 0, 51, 0.20);
  }
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-bottom: ${styles.space(-1)};
`;
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CriticalLevel = styled(View)`
  margin-bottom: ${styles.space(-1)};
`;
const Body = styled(View)`
  flex: 1;
`;

export interface SemesterCourseProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  course: Model.Course;
  degree: Model.Degree;
  catalog: Model.Catalog;
}

export function SemesterCourse(props: SemesterCourseProps) {
  const { course, degree, catalog, ref, ...restOfProps } = props;
  const criticalLevel = course.criticalLevel(degree, catalog);
  return (
    <Draggable>
      <Container {...restOfProps}>
        <Body>
          <SimpleName>{course.simpleName}</SimpleName>
          <FullName>{course.name}</FullName>
          <CriticalLevel>
            {criticalLevel <= 0 ? (
              <Text>
                <Text color={styles.red}>Critical:</Text>&nbsp;delaying this course may delay others
              </Text>
            ) : (
              <Text>Can move ${criticalLevel} semesters.</Text>
            )}
          </CriticalLevel>
          {course.prerequisites ? (
            <PreferredPrerequisite course={course} degree={degree} catalog={catalog} />
          ) : null}
        </Body>
        <DropdownMenu
          header="fdsa"
          actions={{ one: { text: 'something', icon: 'rocket' } }}
          onAction={() => {}}
        />
      </Container>
    </Draggable>
  );
}
