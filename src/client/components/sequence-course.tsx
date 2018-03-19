import * as React from 'react';
import styled from 'styled-components';
import { ActionableText } from './actionable-text';
import { View, Text } from './';
import * as Model from '../models';
import * as styles from '../styles';
import * as Immutable from 'immutable';

const Container = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  cursor: pointer;
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
  highlighted: boolean;
  focused: boolean;
  compactMode: boolean;
  onMouseOver: () => void;
  onMouseExit: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function SequenceCourse(props: SequenceCourseProps) {
  const { course, catalog, user } = props;
  if (typeof course === 'string') {
    return (
      <Container>
        <Text>{course}</Text>
      </Container>
    );
  }

  return (
    <Container
      className="sequence-course"
      onMouseEnter={props.onMouseOver}
      onMouseLeave={props.onMouseExit}
      tabIndex={0}
      style={{
        backgroundColor: /*if*/ props.focused
          ? styles.highlightBlue
          : /*if*/ props.highlighted ? styles.highlight : styles.white,
        outline: /*if*/ props.focused
          ? `${styles.borderWidth} solid ${styles.focusBorderColor}`
          : 'none',
        width: props.compactMode ? '5rem' : 'auto',
        minWidth: props.compactMode ? '5rem' : 'auto',
        padding: props.compactMode ? styles.space(-1) : styles.space(0)
      }}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {/*if*/ props.compactMode ? (
        <View>
          <SimpleName strong>{course.simpleName}</SimpleName>
          <Name>
            <ActionableText small>{course.name}</ActionableText>
          </Name>
          <Critical>
            {/*if*/ course.criticalLevel(user, catalog) <= 0 ? (
              <Text color={styles.red} small>
                Critical
              </Text>
            ) : (
              <Text small>
                Can move {course.criticalLevel(user, catalog)}{' '} later
              </Text>
            )}
          </Critical>
        </View>
      ) : (
        <View>
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
                Can be taken as many as {course.criticalLevel(user, catalog)}{' '}
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
                      course instanceof Model.Course
                        ? course.simpleName
                        : course
                  )
                  .map(course => (
                    <PreferredPrerequisiteItem key={course}>
                      <Text small>{course}</Text>
                    </PreferredPrerequisiteItem>
                  ))}
              </PreferredPrerequisiteList>
            </PrerequisiteContainer>
          ) : null}
        </View>
      )}
    </Container>
  );
}
