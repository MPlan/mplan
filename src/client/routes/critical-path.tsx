import * as React from 'react';
import * as Model from '../models';
import { View, Text, Button, Prerequisite } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';

const GraphContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  /* align-items: flex-start; */
  overflow: auto;
`;

const Level = styled(View)`
  width: 15rem;
  min-width: 15rem;
  margin: auto;
  margin-left: 1rem;
`;

const CourseLevelWrapper = styled(View)`
  margin: ${styles.space(0)};
  border: ${styles.border};
`;

const CourseContainer = styled(View)`
  padding: ${styles.space(0)};
`;

const CourseHeader = styled(View)`
  margin-bottom: ${styles.space(-1)};
`;

const CoursePrerequisites = styled(View)``;

function Course({
  course,
  criticalLevel
}: {
  course: string | Model.Course;
  criticalLevel: number;
}) {
  const courseName =
    /*if*/ course instanceof Model.Course ? course.simpleName : course;

  if (typeof course === 'string') {
    return (
      <CourseContainer>
        <Text>{courseName}</Text>
      </CourseContainer>
    );
  }

  return (
    <CourseContainer>
      <CourseHeader>
        <Text strong>{courseName}</Text>
      </CourseHeader>
      <Text>{course.name}</Text>
      <Text>Critical level: {criticalLevel}</Text>
      <Prerequisite prerequisite={course.prerequisites} />
    </CourseContainer>
  );
}

export class CriticalPath extends Model.store.connect() {
  render() {
    return (
      <GraphContainer>
        {this.store.levels.map((level, levelIndex) => (
          <Level key={levelIndex}>
            {level.map(course => (
              <CourseLevelWrapper
                key={course instanceof Model.Course ? course.id : course}
              >
                <Course
                  key={
                    /*if*/ course instanceof Model.Course ? course.id : course
                  }
                  course={course}
                  criticalLevel={
                    course instanceof Model.Course
                      ? course.criticalLevel(
                          this.store.user,
                          this.store.catalog
                        )
                      : 0
                  }
                />
              </CourseLevelWrapper>
            ))}
          </Level>
        ))}
      </GraphContainer>
    );
  }
}
