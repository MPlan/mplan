import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import * as pluralize from 'pluralize';

import { SortableElement } from 'react-sortable-hoc';
import { Button } from 'components/button';
import { View } from 'components/view';
import { Text } from 'components/text';

const Root = styled(View)`
  flex-direction: row;
  flex: 0 0 auto;
  cursor: move;
  &:hover {
    box-shadow: ${styles.grabbableShadow};
  }
  &:active {
    box-shadow: ${styles.grabbableShadowActive};
  }
  background-color: white;
  z-index: 1;
`;
const Column = styled(View)`
  flex: 1 1 auto;
  margin-right: ${styles.space(0)};
`;
const Name = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CreditHours = styled(Text)`
  font-size: ${styles.space(-1)};
  text-transform: uppercase;
`;
const ButtonContainer = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;

interface CourseProps {
  course: Model.Course.Model;
  added: boolean;
  onToggle: () => void;
}

class Course extends React.PureComponent<CourseProps, {}> {
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
    const { added, course, onToggle } = this.props;
    return (
      <Root>
        <Column>
          <Name>{course.name}</Name>
          <CreditHours>{this.creditHourString}</CreditHours>
        </Column>
        <ButtonContainer>
          <Button onClick={onToggle}>{added ? 'Added' : 'Add'}</Button>
        </ButtonContainer>
      </Root>
    );
  }
}

export const SortableCourse = SortableElement<CourseProps>(props => <Course {...props} />);
