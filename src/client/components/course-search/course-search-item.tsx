import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { Button } from 'components/button';

const Container = styled(View)`
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  padding: ${styles.space(-1)} ${styles.space(0)};
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(0)};
  min-width: 5rem;
`;
const FullName = styled(Text)`
  margin-right: ${styles.space(0)};
`;
const CreditHours = styled(Text)`
  margin-left: auto;
  margin-right: ${styles.space(0)};
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;

export interface CourseSearchItemProps {
  course: Model.Course;
  add?: boolean;
  delete?: boolean;
  onClick: () => void;
  added?: boolean;
}

function creditHoursString(creditHours: number | [number, number] | null | undefined) {
  if (creditHours === null) return '0';
  if (creditHours === undefined) return '0';
  if (Array.isArray(creditHours)) return `${creditHours[0]}-${creditHours[1]}`;
  return creditHours.toString();
}
export function CourseSearchItem(props: CourseSearchItemProps) {
  const { course } = props;

  return (
    <Container>
      <SimpleName>{course.simpleName}</SimpleName>
      <FullName>{course.name}</FullName>
      <CreditHours>({creditHoursString(course.creditHours)})</CreditHours>
      <Button onClick={props.onClick}>
        <Icon
          icon={props.delete ? 'trash' : props.added ? 'check' : 'plus'}
          color={props.delete ? styles.red : styles.blue}
        />
        {props.delete ? 'Remove' : props.added ? 'Added' : 'Add'}
      </Button>
    </Container>
  );
}
