import * as React from 'react';
import * as Model from '../models';
import {
  View,
  Text,
  Button,
  Prerequisite,
  SequenceCourse,
  ActionableText
} from '../components';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten } from '../../utilities/utilities';

const GraphContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  & > *:last-child {
    padding-right: 5rem;
  }
`;

const Level = styled(View)`
  margin-left: 5rem;
  min-width: 13rem;
  width: 13rem;
`;

const LevelCard = styled(View)`
  flex: 1;

  & > * {
    flex-shrink: 0;
    margin-top: auto;
    margin-bottom: ${styles.space(2)};
  }

  & > *:last-child {
    margin-bottom: auto;
  }
`;

const LevelHeader = styled(View)`
  margin: ${styles.space(0)};
  /* margin-left: ${styles.space(-1)}; */
  justify-content: flex-end;
  min-height: 4rem;
`;

const PrerequisiteContainer = styled(View)``;

const Header = styled(View)`
  padding: ${styles.space(0)};
  flex-direction: row;
`;

const HeaderMain = styled(View)`
  flex: 1;
  max-width: 50rem;
`;

const HeaderRight = styled(View)``;

const SequenceContainer = styled(View)``;

export class Sequence extends Model.store.connect({
  initialState: {
    mouseOverCourse: undefined as undefined | string | Model.Course,
    selectedCourse: undefined as undefined | string | Model.Course
  }
}) {
  handleCourseMouseOver(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      mouseOverCourse: course
    }));
  }

  handleCourseMouseExit(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      mouseOverCourse: undefined
    }));
  }

  handleCourseFocus(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      selectedCourse: course
    }));
  }
  handleCourseBlur(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      selectedCourse: undefined
    }));
  }

  handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.setState(previousState => ({
        ...previousState,
        selectedCourse: undefined
      }));
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  courseHighlighted(course: string | Model.Course) {
    if (typeof course === 'string') return false;
    const bestOption = course.bestOption(
      this.store.catalog,
      this.store.user.preferredCourses
    );
    if (this.state.mouseOverCourse === undefined) {
      return bestOption.contains(this.state.selectedCourse || '');
    }
    return bestOption.contains(this.state.mouseOverCourse || '');
  }

  courseFocused(course: string | Model.Course) {
    if (this.state.mouseOverCourse === undefined) {
      return course === this.state.selectedCourse;
    }
    return this.state.mouseOverCourse === course;
  }

  render() {
    return (
      <SequenceContainer>
        <Header>
          <HeaderMain>
            <Text strong extraLarge color={styles.textLight}>
              Course Sequence
            </Text>
            <Text color={styles.textLight}>
              This page includes every course and their prerequisites from the
              degree page. Use this page to see what classes you have to take
              first. <ActionableText>Click here for more info.</ActionableText>
            </Text>
          </HeaderMain>
        </Header>
        <GraphContainer>
          {this.store.levels.map((level, levelIndex) => (
            <Level key={levelIndex}>
              <LevelHeader>
                <Text large strong color={styles.textLight}>
                  Level {levelIndex + 1}
                </Text>
                {/*if*/ levelIndex <= 0 ? (
                  <Text small color={styles.textLight}>
                    These classes have been found to have no prerequisites.
                  </Text>
                ) : (
                  <Text small color={styles.textLight}>
                    You need to have taken at least {levelIndex}{' '}
                    {levelIndex > 1 ? 'semesters' : 'semester'} before taking
                    any classes in this level.
                  </Text>
                )}
              </LevelHeader>
              <LevelCard>
                {level.map(course => (
                  <SequenceCourse
                    key={
                      /*if*/ course instanceof Model.Course ? course.id : course
                    }
                    course={course}
                    catalog={this.store.catalog}
                    user={this.store.user}
                    onMouseOver={() => this.handleCourseMouseOver(course)}
                    onMouseExit={() => this.handleCourseMouseExit(course)}
                    onBlur={() => this.handleCourseBlur(course)}
                    onFocus={() => this.handleCourseFocus(course)}
                    focused={this.courseFocused(course)}
                    highlighted={this.courseHighlighted(course)}
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
