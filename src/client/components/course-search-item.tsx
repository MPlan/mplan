import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';

const Container = styled(View)`
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  /* margin-bottom: ${styles.space(-1)}; */
  padding: ${styles.space(-1)} ${styles.space(0)};
  height: 2rem;
  &:hover {
    box-shadow: 0 0.1rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  &:active {
    box-shadow: 0 0.2rem 1.3rem 0 rgba(12, 0, 51, 0.2);
  }
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(0)};
  min-width: 6rem;
`;
const FullName = styled(Text)`
  margin-right: ${styles.space(0)};
`;
const CreditHours = styled(Text)`
  margin-left: auto;
  margin-right: ${styles.space(0)};
`;
const Icon = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 2rem;
`;

export interface CourseSearchItemProps {
  course: Model.Course;
  add?: boolean;
  delete?: boolean;
  onClick: () => void;
}

export function CourseSearchItem(props: CourseSearchItemProps) {
  const { course } = props;

  return (
    <Container onClick={props.onClick}>
      <SimpleName>{course.simpleName}</SimpleName>
      <FullName>{course.name}</FullName>
      <CreditHours>({course.creditHours})</CreditHours>
      <Icon>
        <Fa
          icon={props.delete ? 'trash' : 'plus'}
          color={props.delete ? styles.red : styles.blue}
        />
      </Icon>
    </Container>
  );
}
