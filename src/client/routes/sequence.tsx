import * as React from 'react';
import * as Model from '../models';
import {
  View,
  Text,
  Button,
  Prerequisite,
  SequenceCourse,
  courseIdClassName,
  ActionableText,
  FloatingActionButton,
} from '../components';
import styled from 'styled-components';
import * as styles from '../styles';
import { flatten, createClassName } from '../../utilities/utilities';
import * as Immutable from 'immutable';

interface Point {
  y: number;
  x: number;
}

interface Edge {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const GraphContainer = styled(View)`
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
  justify-content: flex-end;
  min-height: 4rem;
`;

const PrerequisiteContainer = styled(View)``;

const Header = styled(View)`
  padding: ${styles.space(1)};
  flex-direction: row;
`;

const HeaderMain = styled(View)`
  flex: 1;
  max-width: 50rem;
`;

const HeaderRight = styled(View)``;

const SequenceContainer = styled(View)`
  flex: 1;
  overflow: auto;
`;

const SvgArrowContainer = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -10;
`;

export class Sequence extends Model.store.connect({
  initialState: {
    mouseOverCourse: undefined as undefined | string | Model.Course,
    selectedCourse: undefined as undefined | string | Model.Course,
    compactMode: false,
    edges: [] as Edge[],
  },
}) {
  containerElement: HTMLElement | undefined;

  componentDidMount() {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    this.handleContainerScroll();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    if (!this.containerElement) return;
    this.containerElement.removeEventListener('scroll', this.handleContainerScroll);
  }

  handleRef = (element: HTMLElement | undefined) => {
    this.containerElement = element;
    if (!element) return;
    element.addEventListener('scroll', this.handleContainerScroll);
  };

  handleCompactModeToggle = () => {
    this.setState(previousState => ({
      ...previousState,
      compactMode: !previousState.compactMode,
    }));
  };

  handleCourseMouseOver(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      mouseOverCourse: course,
    }));
  }

  handleCourseMouseExit(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      mouseOverCourse: undefined,
    }));
  }

  handleCourseFocus(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      selectedCourse: course,
    }));
  }
  handleCourseBlur(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      selectedCourse: undefined,
    }));
  }

  handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.setState(previousState => ({
        ...previousState,
        selectedCourse: undefined,
      }));
    }
  };

  calculateEdges() {
    const catalog = this.store.catalog;
    const user = this.store.user;

    const pointMap = user
      .closure(catalog)
      .map(course => {
        const sequenceCourseElement = document.querySelector(`.${courseIdClassName(course)}`);
        if (!sequenceCourseElement) return undefined;

        const rect = sequenceCourseElement.getBoundingClientRect();
        const left = {
          y: rect.top + rect.height / 2,
          x: rect.left,
        };
        const right = {
          y: rect.top + rect.height / 2,
          x: rect.left + rect.width,
        };

        return { course, left, right };
      })
      .filter(x => !!x)
      .map(x => x!)
      .reduce(
        (acc, { course, left, right }) => acc.set(course, { left, right }),
        Immutable.Map<string | Model.Course, { left: Point; right: Point }>(),
      );

    const edges = flatten(
      user
        .closure(catalog)
        .filter(course => course instanceof Model.Course)
        .map(course => course as Model.Course)
        .map(course => {
          const options = course.bestOption(catalog, user.preferredCourses);
          const coursePoints = pointMap.get(course);
          if (!coursePoints) return undefined;
          const courseDepth = course.depth(catalog, user.preferredCourses);
          const edges = options
            .map(option => {
              const depth =
                /*if*/ option instanceof Model.Course
                  ? option.depth(catalog, user.preferredCourses)
                  : 0;
              const optionPoints = pointMap.get(option);
              if (!optionPoints) return undefined;
              if (depth < courseDepth) {
                const x1 = optionPoints.right.x;
                const y1 = optionPoints.right.y;
                const x2 = coursePoints.left.x;
                const y2 = coursePoints.left.y;
                const key = `edge-${[
                  createClassName(course.id),
                  createClassName(option instanceof Model.Course ? option.id : option),
                ]
                  .sort()
                  .join('__')}`;
                return { key, x1, y1, x2, y2 };
              } else {
                const x1 = coursePoints.right.x;
                const y1 = coursePoints.right.y;
                const x2 = optionPoints.left.x;
                const y2 = optionPoints.left.y;
                const key = `edge-${[
                  createClassName(course.id),
                  createClassName(option instanceof Model.Course ? option.id : option),
                ]
                  .sort()
                  .join('__')}`;
                return { key, x1, y1, x2, y2 };
              }
            })
            .filter(x => !!x)
            .map(x => x!)
            .toArray();
          return edges;
        })
        .filter(x => !!x)
        .map(x => x!)
        .toArray(),
    );

    return edges;
  }

  // transform `this.store.user.preferredCourses` to edge pairs
  handleContainerScroll = () => {
    const edges = this.calculateEdges();
    this.setState(previousState => ({
      ...previousState,
      edges,
    }));
  };

  courseHighlighted(course: string | Model.Course) {
    if (typeof course === 'string') return false;
    const bestOption = course.bestOption(this.store.catalog, this.store.user.preferredCourses);
    if (this.state.mouseOverCourse === undefined) {
      const selectedCourse = this.state.selectedCourse;
      if (bestOption.contains(selectedCourse || '')) return true;
      if (
        selectedCourse instanceof Model.Course &&
        selectedCourse
          .bestOption(this.store.catalog, this.store.user.preferredCourses)
          .contains(course || '')
      ) {
        return true;
      }
      return false;
    }
    if (bestOption.contains(this.state.mouseOverCourse || '')) return true;
    const selectedCourse = this.state.mouseOverCourse;
    if (
      selectedCourse instanceof Model.Course &&
      selectedCourse
        .bestOption(this.store.catalog, this.store.user.preferredCourses)
        .contains(course || '')
    ) {
      return true;
    }
    return false;
  }

  courseFocused(course: string | Model.Course) {
    if (this.state.mouseOverCourse === undefined) {
      return course === this.state.selectedCourse;
    }
    return this.state.mouseOverCourse === course;
  }

  render() {
    return (
      <SequenceContainer innerRef={this.handleRef}>
        <Header>
          <HeaderMain>
            <Text strong extraLarge color={styles.textLight}>
              Course Sequence
            </Text>
            <Text color={styles.textLight}>
              This page includes every course and their prerequisites from the degree page. Use this
              page to see what classes you have to take first.{' '}
              <ActionableText>Click here for more info.</ActionableText>
            </Text>
          </HeaderMain>
          <HeaderRight>
            <label>
              <Text>Compact mode?&nbsp;</Text>
              <input
                type="checkbox"
                defaultChecked={this.state.compactMode}
                onChange={this.handleCompactModeToggle}
              />
            </label>
          </HeaderRight>
        </Header>
        <GraphContainer>
          {this.store.levels.map((level, levelIndex) => (
            <Level
              key={levelIndex}
              style={{
                width: this.state.compactMode ? '4rem' : '13rem',
                minWidth: this.state.compactMode ? '4rem' : '13rem',
              }}
            >
              {/*if*/ !this.state.compactMode ? (
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
                      {levelIndex > 1 ? 'semesters' : 'semester'} before taking any classes in this
                      level.
                    </Text>
                  )}
                </LevelHeader>
              ) : null}
              <LevelCard>
                {level.map(course => (
                  <SequenceCourse
                    key={/*if*/ course instanceof Model.Course ? course.id : course}
                    course={course}
                    catalog={this.store.catalog}
                    user={this.store.user}
                    onMouseOver={() => this.handleCourseMouseOver(course)}
                    onMouseExit={() => this.handleCourseMouseExit(course)}
                    onBlur={() => this.handleCourseBlur(course)}
                    onFocus={() => this.handleCourseFocus(course)}
                    focused={this.courseFocused(course)}
                    highlighted={this.courseHighlighted(course)}
                    compactMode={this.state.compactMode}
                  />
                ))}
              </LevelCard>
            </Level>
          ))}
        </GraphContainer>
        <FloatingActionButton message="add course to degree" actions={{ one: 'one', two: 'two' }} />
        <SvgArrowContainer className="svg-arrow-container">
          <svg width={'100%'} height={'100%'}>
            {this.state.edges.map((edge, index) => {
              return (
                <line
                  key={edge.key}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  style={{ stroke: styles.black }}
                />
              );
            })}
          </svg>
        </SvgArrowContainer>
      </SequenceContainer>
    );
  }
}
