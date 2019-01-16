import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Caption } from 'components/caption';
import { Card } from 'components/card';
import { DropdownMenu } from 'components/dropdown-menu';
import { ActionableText as _ActionableText } from 'components/actionable-text';
import { RightClickMenu } from 'components/right-click-menu';

const Root = styled(View)`
  margin-bottom: ${styles.space(0)};
`;
const TitleRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  & > *:not(:last-child) {
    margin-right: ${styles.space(-1)};
  }
  margin-bottom: ${styles.space(0)};
  align-items: flex-end;
`;
const Title = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
`;
const Courses = styled(View)`
  margin-bottom: ${styles.space(0)};
`;
const Course = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  align-items: center;
  min-height: ${styles.space(2)};
  transition: all 200ms;
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  & > *:not(:last-child) {
    margin-right: ${styles.space(-1)};
  }
`;
const Header = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
  & > *:not(:last-child) {
    margin-right: ${styles.space(-1)};
  }
`;
const CourseName = styled(Text)`
  margin-right: ${styles.space(0)};
  flex: 1 1 auto;
`;
const Column = styled(Text)`
  width: 3rem;
  flex: 0 0 auto;
  text-align: right;
`;
const MenuColumn = styled(View)`
  flex: 0 0 auto;
  width: 2rem;
  align-items: flex-end;
`;
const ActionableText = styled(_ActionableText)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  align-self: stretch;
  transition: all 200ms;
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
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
  onEdit: () => void;
}

export class RequirementGroup extends React.PureComponent<RequirementGroupProps> {
  groupActions = {
    edit: {
      text: 'Edit courses',
      icon: 'pencil',
      color: styles.blue,
    },
    rearrange: {
      text: 'Rearrange courses',
      icon: 'bars',
    },
  };

  courseActionsDone = {
    toggle: {
      text: 'Mark as done',
      icon: 'check',
      color: styles.success,
    },
    catalog: {
      text: 'View in catalog',
      icon: 'chevronRight',
      color: styles.blue,
    },
    remove: {
      text: 'Remove course',
      icon: 'trash',
      color: styles.danger,
    },
  };

  courseActionsRemoveDone = {
    toggle: {
      text: 'Mark as incomplete',
      icon: 'times',
    },
    catalog: {
      text: 'View in catalog',
      icon: 'chevronRight',
      color: styles.blue,
    },
    remove: {
      text: 'Remove course',
      icon: 'trash',
      color: styles.danger,
    },
  };

  handleGroupActions = (action: keyof RequirementGroup['groupActions']) => {
    if (action === 'edit') {
      this.props.onEdit();
      return;
    }
  };

  render() {
    const { name, courses } = this.props;

    return (
      <RightClickMenu actions={this.groupActions} onAction={this.handleGroupActions} header={name}>
        {rightClickProps => (
          <Root {...rightClickProps}>
            <TitleRow>
              <Title>{name}</Title>
              <DropdownMenu
                actions={this.groupActions}
                onAction={this.handleGroupActions}
                header={name}
              />
            </TitleRow>
            <Card>
              <Header>
                <CourseName>
                  <Caption>
                    <strong>Course name</strong>
                  </Caption>
                </CourseName>
                <Column>
                  <Caption>
                    <strong>Credits</strong>
                  </Caption>
                </Column>
                <Column>
                  <Caption>
                    <strong>Done?</strong>
                  </Caption>
                </Column>
                <MenuColumn />
              </Header>
              <Courses>
                {courses.map(({ id, name, creditHours, completed }) => (
                  <RightClickMenu
                    actions={completed ? this.courseActionsRemoveDone : this.courseActionsDone}
                    onAction={() => {}}
                    header={name}
                  >
                    {rightClickProps => (
                      <Course key={id} {...rightClickProps}>
                        <CourseName>{name}</CourseName>
                        <Column>({creditHours})</Column>
                        <Column>
                          <input type="checkbox" checked={completed} />
                        </Column>
                        <MenuColumn>
                          <DropdownMenu
                            actions={
                              completed ? this.courseActionsRemoveDone : this.courseActionsDone
                            }
                            onAction={() => {}}
                            header={name}
                          />
                        </MenuColumn>
                      </Course>
                    )}
                  </RightClickMenu>
                ))}
              </Courses>
              <ActionableText>Edit courses…</ActionableText>
            </Card>
          </Root>
        )}
      </RightClickMenu>
    );
  }
}
