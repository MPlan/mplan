import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
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
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-2)};
`;
const CheckboxContainer = styled(View)`
  min-width: 5rem;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Checkbox = styled.input``;

export interface DegreeGroupCourseProps {
  course: string | Model.Course;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DegreeGroupCourse({ course, onChange }: DegreeGroupCourseProps) {
  if (typeof course === 'string') {
    return (
      <Container>
        <NonCourseName>{course}</NonCourseName>
        <CheckboxContainer>
          <Checkbox type="checkbox" onChange={onChange} />
        </CheckboxContainer>
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
    </Container>
  );
}
