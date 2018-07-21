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

const Container = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  cursor: pointer;
  transition: all 0.2s;
  width: 6rem;
  min-width: 6rem;
  padding: ${styles.space(-1)};
`;
const SimpleName = styled(Text)``;
const NameCompact = styled(ActionableText)`
  margin-bottom: ${styles.space(-1)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Critical = styled(View)``;

export interface SequenceCourseProps {
  course: string | Model.Course;
  highlighted: boolean;
  focused: boolean;
  dimmed: boolean;
  onMouseOver: () => void;
  onMouseExit: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function courseIdClassName(course: string | Model.Course) {
  return `course-id-${createClassName(course instanceof Model.Course ? course.id : course)}`;
}

export class Course extends React.PureComponent<SequenceCourseProps, {}> {
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
        <View>
          <SimpleName strong>{course.simpleName}</SimpleName>
          <NameCompact>
            <ActionableText small onClick={this.goToCatalog}>
              {course.name}
            </ActionableText>
          </NameCompact>
          <Critical>
            {/*if*/ course.criticalLevel() <= 0 ? (
              <Text color={styles.red} small>
                Critical
              </Text>
            ) : (
              <Text small>Can move {course.criticalLevel()} later</Text>
            )}
          </Critical>
        </View>
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
