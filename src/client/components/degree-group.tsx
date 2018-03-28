import * as React from 'react';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { ActionableText } from './actionable-text';
import styled from 'styled-components';
import { DegreeGroupCourse } from './degree-group-course';
import * as styles from '../styles';

const Container = styled(View)`
  max-width: 25rem;
`;
const Header = styled(View)`
  margin-bottom: ${styles.space(0)};
  color: ${styles.textLight};
  & * {
    color: ${styles.textLight};
  }
`;
const NameAndCredits = styled(View)`
  flex-direction: row;
`;
const Name = styled(Text)`
  flex: 1;
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
`;
const Credits = styled(Text)``;
const Description = styled(Text)``;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
`;
const NameHeader = styled(Text)`
  font-size: ${styles.space(-1)};
  margin-right: auto;
`;
const CompletedHeader = styled(Text)`
  font-size: ${styles.space(-1)};
  width: 5rem;
  text-align: center;
`;
const CardHeaders = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const Courses = styled(View)``;
const AddCourseContainer = styled(View)``;

export interface DegreeGroupProps {
  degreeGroup: Model.DegreeGroup;
}

export function DegreeGroup(props: DegreeGroupProps) {
  const { degreeGroup } = props;
  const creditHoursMin = props.degreeGroup.courses.reduce(
    (creditHoursMin, next) =>
      next instanceof Model.Course ? next.creditsMin || next.creditHoursMin || 0 : creditHoursMin,
    0,
  );
  const creditHoursMax = props.degreeGroup.courses.reduce(
    (creditHoursMax, next) =>
      next instanceof Model.Course ? next.credits || next.creditHours || 0 : 0,
    0,
  );

  return (
    <Container>
      <Header>
        <NameAndCredits>
          <Name>{degreeGroup.name}</Name>
          <Credits>
            {/*if*/ creditHoursMin === creditHoursMax
              ? `${creditHoursMin}`
              : `${creditHoursMin} - ${creditHoursMax}`}&nbsp;credits
          </Credits>
        </NameAndCredits>
        <Description>{degreeGroup.description}</Description>
      </Header>
      <Card>
        <CardHeaders>
          <NameHeader>Course name</NameHeader>
          <CompletedHeader>Completed ?</CompletedHeader>
        </CardHeaders>
        <Courses>
          {degreeGroup.courses.map(course => (
            <DegreeGroupCourse
              key={course instanceof Model.Course ? course.id : course}
              course={course}
              onChange={() => {}}
            />
          ))}
        </Courses>
        <AddCourseContainer>
          <ActionableText small>Add course to this group...</ActionableText>
        </AddCourseContainer>
      </Card>
    </Container>
  );
}
