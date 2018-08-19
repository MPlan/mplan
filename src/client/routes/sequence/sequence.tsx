import * as React from 'react';
import * as Model from 'models';
import * as Immutable from 'immutable';
import * as styles from 'styles';
import styled from 'styled-components';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { oneLine } from 'common-tags';
import { flatten, createClassName, wait } from 'utilities/utilities';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { ActionableText } from 'components/actionable-text';
import { FloatingActionButton } from 'components/floating-action-button';
import { Course, courseIdClassName } from './components/course';
import { LevelHeader } from './components/level-header';

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
  nodes: Immutable.Set<string | Model.Course>;
}

const GraphContainer = styled(View)`
  flex-direction: row;
  & > *:last-child {
    padding-right: 5rem;
  }
  position: relative;
  flex: 1 1 auto;
  align-items: flex-start;
  padding-bottom: ${styles.space(1)};
`;
const Level = styled(View)`
  margin-left: 5rem;
  min-width: 5rem;
  width: 5rem;
`;
const LevelCard = styled(View)`
  flex: 1 1 auto;
  & > * {
    flex-shrink: 0;
    margin-top: auto;
    margin-bottom: ${styles.space(2)};
  }
  & > *:last-child {
    margin-bottom: auto;
  }
`;
const SvgArrowContainer = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -10;
`;
const GraphWrapper = styled(View)`
  flex-direction: row;
  position: relative;
  margin: auto;
`;

export interface SequenceProps {
  catalog: Model.Catalog;
  degree: Model.Degree;
}
export interface SequenceState {
  mouseOverCourse: string | Model.Course | undefined;
  selectedCourse: string | Model.Course | undefined;
  edges: Edge[];
  graphWrapperWidth: number;
  graphWrapperHeight: number;
}

export class Sequence extends React.PureComponent<SequenceProps, SequenceState> {
  constructor(props: SequenceProps) {
    super(props);
    this.state = {
      mouseOverCourse: undefined,
      selectedCourse: undefined,
      edges: [],
      graphWrapperWidth: 1000,
      graphWrapperHeight: 1000,
    };
  }

  mounted = false;
  reflowEvents$ = new Subject<void>();

  graphWrapperRef = React.createRef<HTMLElement>();

  async componentDidMount() {
    this.mounted = true;
    document.addEventListener('keydown', this.handleDocumentKeyDown);

    this.reflowEvents$.pipe(debounceTime(200)).subscribe(() => {
      this.reflowArrows();
    });

    await wait(100);
    this.reflowTrigger();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.mounted = false;
  }

  get focusMode() {
    return !!(this.state.mouseOverCourse || this.state.selectedCourse);
  }

  reflowArrows() {
    const edges = this.calculateEdges();
    this.setState(previousState => {
      const graphWrapperElement = this.graphWrapperRef.current;
      if (!graphWrapperElement) return null;

      return {
        ...previousState,
        edges,
        graphWrapperHeight: (graphWrapperElement && graphWrapperElement.clientHeight) || 1000,
        graphWrapperWidth: (graphWrapperElement && graphWrapperElement.clientWidth) || 1000,
      };
    });
  }

  handleCourseMouseOver(course: string | Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      mouseOverCourse: course,
    }));
  }

  handleCourseMouseExit() {
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
  handleCourseBlur() {
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
    const catalog = this.props.catalog;
    const degree = this.props.degree;

    const hash = Model.hashObjects({ catalog, degree });

    const pointMap = degree
      .closure()
      .map(course => {
        const sequenceCourseElement = document.querySelector(`.${courseIdClassName(course)}`);
        if (!sequenceCourseElement) return undefined;
        const parentElement = document.querySelector('.graph-wrapper');
        if (!parentElement) return undefined;

        const parentRect = parentElement.getBoundingClientRect();
        const rect = sequenceCourseElement.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2 - parentRect.top;
        const left = {
          y: middleY / parentRect.height,
          x: (rect.left - parentRect.left) / parentRect.width,
        };
        const right = {
          y: middleY / parentRect.height,
          x: (rect.left + rect.width - parentRect.left) / parentRect.width,
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
      degree
        .closure()
        .filter(course => course instanceof Model.Course)
        .map(course => course as Model.Course)
        .map(course => {
          const options = course.bestOption();
          const coursePoints = pointMap.get(course);
          if (!coursePoints) return undefined;
          const courseDepth = course.depth();
          const edges = options
            .map(option => {
              const depth = /*if*/ option instanceof Model.Course ? option.depth() : 0;
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
                const nodes = Immutable.Set<string | Model.Course>()
                  .add(option)
                  .add(course);
                return { key, x1, y1, x2, y2, nodes };
              } else if (depth > courseDepth) {
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
                const nodes = Immutable.Set<string | Model.Course>()
                  .add(option)
                  .add(course);
                return { key, x1, y1, x2, y2, nodes };
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

    const minX = edges.reduce((minX, edge) => {
      if (edge.x1 < minX) return edge.x1;
      if (edge.x2 < minX) return edge.x2;
      return minX;
    }, 999999999);

    if (minX === 999999999) {
      return [];
    }

    const adjustedEdges = edges.map(edge => ({
      ...edge,
      x1: edge.x1 - minX,
      x2: edge.x2 - minX,
    }));

    return adjustedEdges;
  }

  reflowTrigger = () => {
    this.reflowEvents$.next();
  };

  courseHighlighted(course: string | Model.Course) {
    if (typeof course === 'string') return undefined;

    const focusedCourse = this.state.mouseOverCourse
      ? this.state.mouseOverCourse
      : this.state.selectedCourse;

    const thisCourseBestOption = course.bestOptionWithConcurrent();

    const thisCourseConcurrent = thisCourseBestOption
      .filter(tuple => tuple.canTakeConcurrently)
      .map(tuple => tuple.course);

    const thisCoursePrevious = thisCourseBestOption
      .filter(tuple => !tuple.canTakeConcurrently)
      .map(tuple => tuple.course);

    if (thisCourseConcurrent.contains(focusedCourse || '')) {
      return 'CONCURRENT_NEXT';
    }

    if (thisCoursePrevious.contains(focusedCourse || '')) {
      // this course has the focused course as a prerequisite
      return 'NEXT';
    }

    if (focusedCourse instanceof Model.Course) {
      const focusedCourseBestOption = focusedCourse.bestOptionWithConcurrent();
      const focusedCourseConcurrent = focusedCourseBestOption
        .filter(tuple => tuple.canTakeConcurrently)
        .map(tuple => tuple.course);
      const focusedCoursePrevious = focusedCourseBestOption
        .filter(tuple => !tuple.canTakeConcurrently)
        .map(tuple => tuple.course);

      if (focusedCourseConcurrent.contains(course)) return 'CONCURRENT_BEFORE';
      if (focusedCoursePrevious.contains(course)) return 'PREVIOUS';
    }

    return undefined;
  }

  courseFocused(course: string | Model.Course) {
    if (this.state.mouseOverCourse === undefined) {
      return course === this.state.selectedCourse;
    }
    return this.state.mouseOverCourse === course;
  }

  courseDimmed(course: string | Model.Course) {
    if (!this.focusMode) return false;
    if (this.courseHighlighted(course)) return false;
    if (this.courseFocused(course)) return false;
    return true;
  }

  renderSubtitle = () => {
    return (
      <Text color={styles.textLight}>
        This page includes every course and their prerequisites from the degree page.
        <br /> Use this page to see what classes you have to take first.{' '}
        <ActionableText>Click here for more info.</ActionableText>
      </Text>
    );
  };

  render() {
    const graphWidth = this.state.graphWrapperWidth;
    const graphHeight = this.state.graphWrapperHeight;
    const masteredDegree = this.props.degree.masteredDegree();
    const focusedCourse = this.state.mouseOverCourse
      ? this.state.mouseOverCourse
      : this.state.selectedCourse;
    return (
      <Page title={`${masteredDegree.name} Sequence`} renderSubtitle={this.renderSubtitle}>
        <GraphContainer
          className="graph-container"
          onScroll={this.reflowTrigger}
          onMouseMove={this.reflowTrigger}
        >
          <GraphWrapper className="graph-wrapper" innerRef={this.graphWrapperRef}>
            {this.props.degree.levels().map((level, levelIndex) => (
              <Level key={levelIndex}>
                <LevelHeader level={levelIndex} />
                <LevelCard>
                  {level
                    .sortBy(course => (course instanceof Model.Course ? course.simpleName : course))
                    .map(course => (
                      <Course
                        key={/*if*/ course instanceof Model.Course ? course.id : course}
                        selectedCourseName={
                          (focusedCourse instanceof Model.Course
                            ? focusedCourse.simpleName
                            : focusedCourse) || ''
                        }
                        course={course}
                        onMouseOver={() => this.handleCourseMouseOver(course)}
                        onMouseExit={() => this.handleCourseMouseExit()}
                        onBlur={() => this.handleCourseBlur()}
                        onFocus={() => this.handleCourseFocus(course)}
                        focused={this.courseFocused(course)}
                        highlighted={this.courseHighlighted(course)}
                        dimmed={this.courseDimmed(course)}
                      />
                    ))}
                </LevelCard>
              </Level>
            ))}
            <SvgArrowContainer className="svg-arrow-container">
              <svg
                width={'100%'}
                height={'100%'}
                style={{ marginLeft: '12.3rem' }}
                viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                preserveAspectRatio="none"
              >
                {this.state.edges.map(edge => {
                  const nodesFocused = edge.nodes.some(node => this.courseFocused(node));
                  const nodesDimmed = edge.nodes.some(node => this.courseDimmed(node));
                  const startingPointX = edge.x1;
                  const startingPointY = edge.y1;
                  const finalPointX = edge.x2;
                  const finalPointY = edge.y2;
                  const midPoint = (finalPointX - startingPointX) / 2 + startingPointX;
                  const bezierPoint1X = midPoint;
                  const bezierPoint1Y = edge.y1;
                  const bezierPoint2X = midPoint;
                  const bezierPoint2Y = edge.y2;
                  return (
                    <path
                      key={edge.key}
                      d={oneLine`
                      M ${startingPointX * graphWidth},${startingPointY * graphHeight}
                      C ${bezierPoint1X * graphWidth},${bezierPoint1Y * graphHeight}
                        ${bezierPoint2X * graphWidth},${bezierPoint2Y * graphHeight}
                        ${finalPointX * graphWidth},${finalPointY * graphHeight}
                      `}
                      style={{
                        fill: 'none',
                        stroke: /*if*/ nodesFocused ? styles.blue : styles.grayLight,
                        zIndex: /*if*/ nodesFocused ? 100 : 0,
                        strokeWidth: /*if*/ nodesFocused ? 3 : 1,
                        opacity: nodesDimmed ? 0.25 : 1,
                      }}
                    />
                  );
                })}
              </svg>
            </SvgArrowContainer>
          </GraphWrapper>
        </GraphContainer>
        <FloatingActionButton
          message="Add..."
          actions={{
            course: {
              text: 'Course to degree',
              icon: 'plus',
              color: styles.blue,
            },
          }}
        />
      </Page>
    );
  }
}
