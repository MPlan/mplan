import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';

import { View } from 'components/view';
import { SortableElement } from 'react-sortable-hoc';
import { Text } from 'components/text';
import { Fa as _Fa } from 'components/fa';
import { Switch as _Switch } from 'components/switch';
import { TransparentButton } from 'components/button';

const { getSimpleName } = Model.Course;

const Root = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: ${styles.space(-1)};
  background-color: ${styles.white};
  cursor: grab;
  &:hover {
    background-color: ${styles.whiteBis};
  }
  &:active {
    cursor: grabbing;
    background-color: ${styles.whiteTer};
  }
  user-select: none;
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(0)};
  min-width: 4rem;
`;
const Name = styled(Text)`
  margin-right: auto;
`;
const Switch = styled(_Switch)`
  margin-left: ${styles.space(0)};
  margin-right: 2rem;
`;
const Fa = styled(_Fa)`
  margin-left: ${styles.space(0)};
  margin-right: ${styles.space(0)};
`;

export interface CourseProps {
  course: Model.Course.Model;
  preset: boolean;
  onRemove: () => void;
  onTogglePreset: () => void;
}

class Course extends React.PureComponent<CourseProps, {}> {
  get creditHourString() {
    const { course } = this.props;
    if (!course.creditHours) return '';
    const { creditHours } = course;
    if (Array.isArray(creditHours)) {
      const first = creditHours[0];
      const second = creditHours[1];
      return `${first} - ${second} credits`;
    }
    return `${creditHours} ${pluralize('credit', creditHours)}`;
  }

  render() {
    const { course, onRemove, preset, onTogglePreset } = this.props;
    return (
      <Root className={`sortable-${course.subjectCode}-${course.courseNumber}`}>
        <Fa icon="bars" />
        <SimpleName>{getSimpleName(course)}</SimpleName>
        <Name>{course.name}</Name>
        <Switch checked={preset} onChange={onTogglePreset} />
        <TransparentButton onClick={onRemove}>Remove</TransparentButton>
      </Root>
    );
  }
}

export const SortableCourse = SortableElement<CourseProps>(props => <Course {...props} />);
