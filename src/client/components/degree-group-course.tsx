import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';
import { ActionableText } from './actionable-text';
import { DropdownMenu } from './dropdown-menu';
import styled from 'styled-components';
import * as styles from '../styles';

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
const EllipsisButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${styles.space(1)};
  height: ${styles.space(1)};
  border-radius: 99999px;
  outline: none;
  border: none;
  margin-top: 0.2rem;
  &:hover,
  &:focus {
    color: ${styles.blue};
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 0.2;
`;

export interface DegreeGroupCourseProps {
  course: string | Model.Course;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRearrange: () => void;
  onDelete: () => void;
}

const actions = {
  rearrange: { text: 'Rearrange', icon: 'bars' },
  delete: { text: 'Delete', icon: 'trash', color: styles.red },
};

export function DegreeGroupCourse({
  course,
  onChange,
  onDelete,
  onRearrange,
}: DegreeGroupCourseProps) {
  if (typeof course === 'string') {
    return (
      <Container>
        <NonCourseName>{course}</NonCourseName>
        <Checkbox type="checkbox" onChange={onChange} />
      </Container>
    );
  }

  return (
    <Container>
      <NameAndCredits>
        <SimpleNameAndCredits>
          <SimpleName>{course.simpleName}</SimpleName>
          <Credits>{course.creditsString}</Credits>
        </SimpleNameAndCredits>
        <FullName>{course.name}</FullName>
      </NameAndCredits>
      <CheckboxContainer>
        <Checkbox type="checkbox" onChange={onChange} />
      </CheckboxContainer>
      <DropdownMenu
        actions={actions}
        onAction={action => {
          if (action === 'delete') {
            onDelete();
          } else if (action === 'rearrange') {
            onRearrange();
          }
        }}
      />
    </Container>
  );
}
