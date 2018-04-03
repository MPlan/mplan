import * as React from 'react';
import styled from 'styled-components';
import { ActionableText } from './actionable-text';
import { View, Text } from './';
import * as Model from '../models';
import * as styles from '../styles';
import * as Immutable from 'immutable';
import { createClassName } from '../../utilities/utilities';

const Container = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  cursor: pointer;
  transition: all 0.2s;
`;

const SimpleName = styled(Text)``;

const Name = styled(ActionableText)`
  margin-bottom: ${styles.space(-1)};
`;

const NameCompact = styled(ActionableText)`
  margin-bottom: ${styles.space(-1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TooltipName = styled(Text)``;

const Critical = styled(View)`
  margin-bottom: ${styles.space(-1)};
`;

const CriticalCompact = styled(View)``;

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
  degree: Model.Degree;
  highlighted: boolean;
  focused: boolean;
  compactMode: boolean;
  dimmed: boolean;
  onMouseOver: () => void;
  onMouseExit: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function courseIdClassName(course: string | Model.Course) {
  return `course-id-${createClassName(course instanceof Model.Course ? course.id : course)}`;
}

export function SequenceCourse(props: SequenceCourseProps) {
  const { course, catalog, degree } = props;

  const style = {
    backgroundColor: /*if*/ props.focused
      ? styles.highlightBlue
      : /*if*/ props.highlighted ? styles.highlight : styles.white,
    outline: /*if*/ props.focused
      ? `${styles.borderWidth} solid ${styles.focusBorderColor}`
      : 'none',
    width: props.compactMode ? '6rem' : 'auto',
    minWidth: props.compactMode ? '6rem' : 'auto',
    padding: props.compactMode ? styles.space(-1) : styles.space(0),
    opacity: props.dimmed ? 0.25 : 1,
  };

  if (typeof course === 'string') {
    return (
      <Container style={style}>
        <Text>{course}</Text>
      </Container>
    );
  }

  return (
    <Container
      className={['sequence-course', courseIdClassName(course)].join(' ')}
      onMouseEnter={props.onMouseOver}
      onMouseLeave={props.onMouseExit}
      tabIndex={0}
      style={style}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {/*if*/ props.compactMode ? (
        <View>
          <SimpleName strong>{course.simpleName}</SimpleName>
          <NameCompact>
            <ActionableText small>{course.name}</ActionableText>
          </NameCompact>
          <CriticalCompact>
            {/*if*/ course.criticalLevel(degree, catalog) <= 0 ? (
              <Text color={styles.red} small>
                Critical
              </Text>
            ) : (
              <Text small>Can move {course.criticalLevel(degree, catalog)} later</Text>
            )}
          </CriticalCompact>
        </View>
      ) : (
        <View>
          <SimpleName strong>{course.simpleName}</SimpleName>
          <Name>
            <ActionableText>{course.name}</ActionableText>
          </Name>
          <Critical>
            {/*if*/ course.criticalLevel(degree, catalog) <= 0 ? (
              <Text small>
                <Text color={styles.red} small>
                  Critical:&nbsp;
                </Text>
                delaying this course may delay graduation.
              </Text>
            ) : (
              <Text small>
                Can be taken as many as {course.criticalLevel(degree, catalog)} semesters later
                without delaying graduation.
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
                  .bestOption(catalog, degree.preferredCourses())
                  .map(course => (course instanceof Model.Course ? course.simpleName : course))
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
