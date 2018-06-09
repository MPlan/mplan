import * as React from 'react';
import styled from 'styled-components';
import { ActionableText } from './actionable-text';
import { View, Text } from './';
import * as Model from '../models';
import * as styles from '../styles';
import * as Immutable from 'immutable';
import { createClassName } from '../../utilities/utilities';
import { PreferredPrerequisite } from './preferred-prerequisite';

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

export interface SequenceCourseProps {
  course: string | Model.Course;
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
  const { course } = props;

  const style = {
    backgroundColor: /*if*/ props.focused
      ? styles.highlightBlue
      : /*if*/ props.highlighted
        ? styles.highlight
        : styles.white,
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
            {/*if*/ course.criticalLevel() <= 0 ? (
              <Text color={styles.red} small>
                Critical
              </Text>
            ) : (
              <Text small>Can move {course.criticalLevel()} later</Text>
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
            {/*if*/ course.criticalLevel() <= 0 ? (
              <Text small>
                <Text color={styles.red} small>
                  Critical:&nbsp;
                </Text>
                delaying this course may delay graduation.
              </Text>
            ) : (
              <Text small>
                Can be taken as many as {course.criticalLevel()} semesters later without delaying
                graduation.
              </Text>
            )}
          </Critical>

          {/*if*/ course.prerequisites ? <PreferredPrerequisite course={course} /> : null}
        </View>
      )}
    </Container>
  );
}
