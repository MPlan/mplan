import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const { getSimpleName } = Model.Course;

const Root = styled(View)`
  flex: 0 0 auto;
  &:hover {
    background-color: ${styles.whiteTer};
  }
  padding: ${styles.space(-1)};
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

export interface CourseProps {
  showDefaults: boolean;
  course: Model.Course.Model;
  preset: boolean;
}

export class Course extends React.PureComponent<CourseProps, {}> {
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
    const { course, preset, showDefaults } = this.props;
    return (
      <Root>
        <SimpleName>{getSimpleName(course)}</SimpleName>
        <SubtitleRow>
          <Caption>
            {course.name} | {this.creditHourString}
          </Caption>
          <Caption>{preset && showDefaults ? 'Default' : ''}</Caption>
        </SubtitleRow>
      </Root>
    );
  }
}
