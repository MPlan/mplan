import * as React from 'react';
import styled from 'styled-components';
import { ActionableText } from './actionable-text';
import { View, Text } from './';
import * as Model from '../models';
import * as styles from '../styles';
import * as Immutable from 'immutable';

const Container = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(1)};
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  /* margin-top: auto; */
  /* margin-bottom: ${styles.space(2)}; */
`;

const SimpleName = styled(Text)``;

const Name = styled(ActionableText)`
  margin-bottom: ${styles.space(-1)};
`;

const Critical = styled(View)`
  margin-bottom: ${styles.space(-1)};
`;

const PrerequisiteContainer = styled(View)``;
const PreferredPrerequisiteHeader = styled(Text)`
  text-decoration: underline;
  margin-bottom: ${styles.space(-1)};
`;
const PreferredPrerequisiteList = styled.ul`
  margin: 0;
  padding: 0 0 0 ${styles.space(1)};
`;
const PreferredPrerequisiteItem = styled.li``;

export interface SequenceCourseProps {
  course: string | Model.Course;
  catalog: Model.Catalog;
  user: Model.User;
}

export function SequenceCourse({ course, catalog, user }: SequenceCourseProps) {
  if (typeof course === 'string') {
    return (
      <Container>
        <Text>{course}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <SimpleName strong>{course.simpleName}</SimpleName>
      <Name>
        <ActionableText>{course.name}</ActionableText>
      </Name>
      <Critical>
        {/*if*/ course.criticalLevel(user, catalog) <= 0 ? (
          <Text small>
            <Text color={styles.red} small>
              Critical:&nbsp;
            </Text>
            delaying this course may delay graduation.
          </Text>
        ) : (
          <Text small>
            Can be take as many as {course.criticalLevel(user, catalog)}{' '}
            semesters later.
          </Text>
        )}
      </Critical>

      {/*if*/ course.prerequisites ? (
        <PrerequisiteContainer>
          <PreferredPrerequisiteHeader small>
            Preferred prerequisites:
          </PreferredPrerequisiteHeader>
          <PreferredPrerequisiteList>
            {course
              .bestOption(catalog, user.preferredCourses)
              .map(
                course =>
                  course instanceof Model.Course ? course.simpleName : course
              )
              .map(course => (
                <PreferredPrerequisiteItem key={course}>
                  <Text small>{course}</Text>
                </PreferredPrerequisiteItem>
              ))}
          </PreferredPrerequisiteList>
        </PrerequisiteContainer>
      ) : null}
    </Container>
  );
}
