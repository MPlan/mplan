import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { Button as _Button } from 'components/button';
import { Fa as _Fa } from 'components/fa';

const { getSimpleName } = Model.Course;

interface RootProps extends ViewProps {
  sortable?: boolean;
}
const Root = styled<RootProps>(View)`
  flex: 0 0 auto;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${styles.space(-1)};
  padding: ${styles.space(-1)};
  background-color: ${styles.white};
  ${props =>
    props.sortable
      ? `
    cursor: grab;
    &:active {
      grabbing;
    }
  `
      : ''};
`;
const Body = styled(View)`
  flex: 1 1 auto;
  margin-right: ${styles.space(-1)};
`;
const SimpleName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-weight: bold;
`;
const SubtitleRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;
const Caption = styled(Text)`
  font-size: ${styles.space(-1)};
  text-transform: uppercase;
`;
const Button = styled(_Button)`
  min-width: 7rem;
`;
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;

export interface CourseProps {
  sortable?: boolean;
  course: Model.Course.Model;
  added: boolean;
  onToggle: () => void;
}

export class Course extends React.PureComponent<CourseProps, {}> {
  get creditHourString() {
    const { course } = this.props;
    if (!course.creditHours) return '';
    const { creditHours } = course;
    if (Array.isArray(creditHours)) {
      const first = creditHours[0];
      const second = creditHours[1];
      return `${first} - ${second} credit hours`;
    }
    return `${creditHours} credit ${pluralize('hours', creditHours)}`;
  }

  render() {
    const { course, added, onToggle, sortable } = this.props;
    return (
      <Root sortable={sortable}>
        <Body>
          <SimpleName>{getSimpleName(course)}</SimpleName>
          <SubtitleRow>
            <Caption>{course.name}</Caption>
            <Caption>{this.creditHourString}</Caption>
          </SubtitleRow>
        </Body>
        <Button onClick={onToggle}>
          {added ? <Fa icon="check" /> : <Fa icon="plus" />} {added ? 'Added' : 'Add'}
        </Button>
      </Root>
    );
  }
}
