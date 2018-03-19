import * as React from 'react';
import * as Model from '../models';
import {
  View,
  Text,
  Button,
  Prerequisite,
  CourseWithPrerequisites
} from '../components';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';

const GraphContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  overflow: auto;
`;

const Level = styled(View)`
  width: 20rem;
  min-width: 20rem;
  margin: 1rem;
`;

const LevelCard = styled(View)`
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
  overflow: auto;
  flex: 1;

  & > * {
    flex-shrink: 0;
  }
`;

const LevelHeader = styled(View)`
  margin: ${styles.space(0)};
  /* margin-left: ${styles.space(-1)}; */
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

const PrerequisiteContainer = styled(View)``;

const Header = styled(View)`
  padding: ${styles.space(0)};
  flex-direction: row;
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View)``;

const SequenceContainer = styled(View)``;

export class Sequence extends Model.store.connect() {
  render() {
    return (
      <SequenceContainer>
        <Header>
          <HeaderMain>
            <Text strong extraLarge>
              Sequence
            </Text>
            <Text>
              To take a course in one level, at least one course in every
              previous level must be taken.
            </Text>
          </HeaderMain>
        </Header>
        <GraphContainer>
          {this.store.levels.map((level, levelIndex) => (
            <Level key={levelIndex}>
              <LevelHeader>
                <Text large strong>
                  Level {levelIndex + 1}
                </Text>
                <Text>
                  {level.length} {level.length > 1 ? 'courses' : 'course'}
                </Text>
              </LevelHeader>
              <LevelCard>
                {level.map(course => (
                  <CourseWithPrerequisites
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
                ))}
              </LevelCard>
            </Level>
          ))}
        </GraphContainer>
      </SequenceContainer>
    );
  }
}
