import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Caption } from 'components/caption';
import { Card } from 'components/card';

const Root = styled(View)``;
const Title = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  margin-bottom: ${styles.space(0)};
  color: ${styles.textLight};
`;
const Courses = styled(View)`
  & > *:not(:last-child) {
    margin-bottom: ${styles.space(-1)};
  }
`;
const Course = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  align-items: center;
  min-height: ${styles.space(2)};
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 200ms;
`;
const Header = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
`;
const CourseName = styled(Text)`
  margin-right: ${styles.space(0)};
  flex: 1 1 auto;
`;
const CreditHours = styled(Text)`
  width: 3rem;
  flex: 0 0 auto;
  text-align: right;
`;
const Completed = styled(Text)`
  width: 3rem;
  flex: 0 0 auto;
  text-align: right;
`;

export interface CourseModel {
  id: string;
  name: string;
  completed: boolean;
  creditHours: number;
}

interface RequirementGroupProps {
  name: string;
  courses: CourseModel[];
  onClickCourse: (courseId: string) => void;
}

export class RequirementGroup extends React.PureComponent<RequirementGroupProps> {
  render() {
    const { name, courses } = this.props;

    return (
      <Root>
        <Title>{name}</Title>
        <Card>
          <Header>
            <CourseName>
              <Caption>
                <strong>Course name</strong>
              </Caption>
            </CourseName>
            <CreditHours>
              <Caption>
                <strong>Credits</strong>
              </Caption>
            </CreditHours>
            <Completed>
              <Caption>
                <strong>Done?</strong>
              </Caption>
            </Completed>
          </Header>
          <Courses>
            {courses.map(({ id, name, creditHours, completed }) => (
              <Course key={id}>
                <CourseName>{name}</CourseName>
                <CreditHours>({creditHours})</CreditHours>
                <Completed>
                  <input type="checkbox" checked={completed} />
                </Completed>
              </Course>
            ))}
          </Courses>
        </Card>
      </Root>
    );
  }
}
