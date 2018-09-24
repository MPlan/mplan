import * as React from 'react';
import * as styles from 'styles';
import * as Model from 'models';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { Caption } from 'components/caption';

const { getSimpleName, getCreditHoursFullString } = Model.Course;

interface RootProps extends ViewProps {
  selected?: boolean;
}
const Root = styled<RootProps>(View)`
  padding: ${styles.space(-1)};
  background-color: ${props => (props.selected ? styles.whiteTer : styles.white)};
`;
const Name = styled(Text)`
  font-weight: bold;
`;
const SubtitleRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${styles.space(-1)};
`;

interface AutosuggestCourseProps {
  course: Model.Course.Model;
  selected: boolean;
}

export class AutosuggestCourse extends React.PureComponent<AutosuggestCourseProps, {}> {
  render() {
    const { course, selected } = this.props;
    return (
      <Root selected={selected}>
        <Name>{getSimpleName(course)}</Name>
        <SubtitleRow>
          <Caption>{course.name}</Caption>
          <Caption>{getCreditHoursFullString(course)}</Caption>
        </SubtitleRow>
      </Root>
    );
  }
}
