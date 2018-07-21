import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import classNames from 'classnames';
import { createClassName } from 'utilities/utilities';
import { history } from 'client/history';

import { ActionableText } from 'components/actionable-text';
import { View } from 'components//view';
import { Text } from 'components/text';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';
import { PreferredPrerequisite } from 'components/preferred-prerequisite';

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

export class SequenceCourse extends React.PureComponent<SequenceCourseProps, {}> {
  get style() {
    return {
      backgroundColor: /*if*/ this.props.focused
        ? styles.highlightBlue
        : /*if*/ this.props.highlighted
          ? styles.highlight
          : styles.white,
      outline: /*if*/ this.props.focused
        ? `${styles.borderWidth} solid ${styles.focusBorderColor}`
        : 'none',
      width: this.props.compactMode ? '6rem' : 'auto',
      minWidth: this.props.compactMode ? '6rem' : 'auto',
      padding: this.props.compactMode ? styles.space(-1) : styles.space(0),
      opacity: this.props.dimmed ? 0.25 : 1,
    };
  }

  actions = {
    view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
  };

  get courseName() {
    const { course } = this.props;
    if (typeof course === 'string') return course;
    return course.simpleName;
  }

  goToCatalog = () => {
    const { course } = this.props;
    if (!(course instanceof Model.Course)) return;
    history.push(`/catalog/${course.subjectCode}/${course.courseNumber}`);
  };

  renderRightClickMenu = (rightClickProps: RightClickProps) => {
    const { course } = this.props;
    const { className: rightClickClassName, ...restOfRightClickProps } = rightClickProps;

    if (typeof course === 'string') {
      return (
        <Container style={this.style}>
          <Text>{course}</Text>
        </Container>
      );
    }

    return (
      <Container
        className={classNames('sequence-course', courseIdClassName(course), rightClickClassName)}
        onMouseEnter={this.props.onMouseOver}
        onMouseLeave={this.props.onMouseExit}
        tabIndex={0}
        style={this.style}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        {...restOfRightClickProps}
      >
        {/*if*/ this.props.compactMode ? (
          <View>
            <SimpleName strong>{course.simpleName}</SimpleName>
            <NameCompact>
              <ActionableText small onClick={this.goToCatalog}>
                {course.name}
              </ActionableText>
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
              <ActionableText onClick={this.goToCatalog}>{course.name}</ActionableText>
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
  };

  render() {
    return (
      <RightClickMenu
        header={this.courseName}
        actions={this.actions}
        onAction={this.goToCatalog}
        render={this.renderRightClickMenu}
      />
    );
  }
}
