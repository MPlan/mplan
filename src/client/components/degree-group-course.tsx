import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { ActionableText } from './actionable-text';
import { DropdownMenu } from './dropdown-menu';
import styled from 'styled-components';
import * as styles from '../styles';
import { RightClickMenu } from './right-click-menu';
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
`;
const NonCourseName = styled(Text)`
  margin-right: auto;
`;
const Credits = styled(Text)`
  margin-left: 2rem;
`;
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

  render() {
    const { course, completed } = this.props;

    const menuHeader = course instanceof Model.Course ? course.simpleName : course;

    if (typeof course === 'string') {
      return (
        <RightClickMenu header={menuHeader} actions={actions} onAction={this.handleActions}>
          <Container>
            <NonCourseName>{course}</NonCourseName>
            <Checkbox type="checkbox" onChange={this.props.onChange} />
          </Container>
        </RightClickMenu>
      );
    }

    return (
      <RightClickMenu header={menuHeader} actions={actions} onAction={this.handleActions}>
        <Container>
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
          <DropdownMenu header={menuHeader} actions={actions} onAction={this.handleActions} />
        </Container>
      </RightClickMenu>
    );
  }
}
