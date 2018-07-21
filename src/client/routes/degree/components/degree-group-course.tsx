import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { DropdownMenu } from 'components/dropdown-menu';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';

import { shallowEqualIgnoringFunctions } from 'utilities/utilities';

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${styles.space(0)};
`;
const SimpleNameAndCredits = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-2)};
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  min-width: 5rem;
  margin-right: ${styles.space(-1)};
`;
const NonCourseName = styled(Text)`
  margin-right: auto;
`;
const Credits = styled(Text)``;
const NameAndCredits = styled(View)`
  flex: 1;
`;
const FullName = styled(ActionableText)`
  color: ${styles.text};
  margin-bottom: ${styles.space(-2)};
`;
const CheckboxContainer = styled.label`
  display: flex;
  min-width: 5rem;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: ${styles.space(-1)} 0;
`;
const Checkbox = styled.input`
  margin-right: ${styles.space(0)};
`;

export interface DegreeGroupCourseProps {
  completed: boolean;
  course: string | Model.Course;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRearrange: () => void;
  onDelete: () => void;
}

const actions = {
  rearrange: { text: 'Reorder courses', icon: 'bars' },
  view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
  delete: { text: 'Delete course', icon: 'trash', color: styles.red },
};

export class DegreeGroupCourse extends React.Component<DegreeGroupCourseProps, {}> {
  get menuHeader() {
    const { course } = this.props;
    return course instanceof Model.Course ? course.simpleName : course;
  }
  handleActions = (action: keyof typeof actions) => {
    if (action === 'delete') {
      this.props.onDelete();
    } else if (action === 'rearrange') {
      this.props.onRearrange();
    }
  };

  shouldComponentUpdate(nextProps: DegreeGroupCourseProps) {
    if (!shallowEqualIgnoringFunctions(nextProps, this.props)) return true;
    return false;
  }

  renderRightClickMenuString = (rightClickProps: RightClickProps) => {
    const { course } = this.props;
    if (course !== 'string') throw new Error('course should have been a string');

    return (
      <Container {...rightClickProps}>
        <NonCourseName>{course}</NonCourseName>
        <Checkbox type="checkbox" onChange={this.props.onChange} />
      </Container>
    );
  };

  renderRightClickMenuCourse = (rightClickProps: RightClickProps) => {
    const { course, completed } = this.props;
    if (!(course instanceof Model.Course)) throw new Error('course should have been a course');

    return (
      <Container {...rightClickProps}>
        <NameAndCredits>
          <SimpleNameAndCredits>
            <SimpleName>{course.simpleName}</SimpleName>
            <Credits>{course.creditsString}</Credits>
          </SimpleNameAndCredits>
          <FullName>{course.name}</FullName>
        </NameAndCredits>
        <CheckboxContainer>
          <Checkbox checked={completed} type="checkbox" onChange={this.props.onChange} />
        </CheckboxContainer>
        <DropdownMenu header={this.menuHeader} actions={actions} onAction={this.handleActions} />
      </Container>
    );
  };

  render() {
    const { course } = this.props;

    if (typeof course === 'string') {
      return (
        <RightClickMenu
          header={this.menuHeader}
          actions={actions}
          onAction={this.handleActions}
          render={this.renderRightClickMenuString}
        />
      );
    }

    return (
      <RightClickMenu
        header={this.menuHeader}
        actions={actions}
        onAction={this.handleActions}
        render={this.renderRightClickMenuCourse}
      />
    );
  }
}
