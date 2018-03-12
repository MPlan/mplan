import * as React from 'react';
import * as Model from '../models';
import { View, Text, Button, Prerequisite } from '../components';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';

const GraphContainer = styled(View) `
  flex: 1;
  flex-direction: row;
  /* align-items: flex-start; */
  overflow: auto;
`;

const Level = styled(View) `
  width: 15rem;
  min-width: 15rem;
  margin: auto;
  margin-left: 5rem;
`;

const CourseLevelWrapper = styled(View) `
  margin: ${styles.space(0)};
  border: ${styles.border};
`;

const CourseContainer = styled(View) `
  padding: ${styles.space(0)};
`;

const CourseHeader = styled(View) `
  margin-bottom: ${styles.space(-1)};
`;

const CoursePrerequisites = styled(View) ``;

function Course({ course }: { course: string | Model.Course }) {
  const courseName = (/*if*/ course instanceof Model.Course
    ? course.simpleName
    : course
  );

  if (typeof course === 'string') {
    return <CourseContainer>
      <Text>{courseName}</Text>
    </CourseContainer>;
  }

  return <CourseContainer>
    <CourseHeader><Text strong>{courseName}</Text></CourseHeader>
    <Text>{course.name}</Text>
    <Prerequisite prerequisite={course.prerequisites} />
  </CourseContainer>;
}

export class CriticalPath extends Model.store.connect() {

  render() {
    return <GraphContainer>
      {this.store.levels.map(level => <Level>
        {level.map(course => <CourseLevelWrapper>
          <Course
            key={/*if*/ course instanceof Model.Course ? course.id : course}
            course={course}
          />
        </CourseLevelWrapper>)}
      </Level>)}
    </GraphContainer>;
  }
}
