import * as React from 'react';
import { View, Text, Semester, FloatingActionButton } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import { allCombinations } from '../models';
import { Subject } from 'rxjs/Subject';
import { map, takeUntil, take, startWith } from 'rxjs/operators';

const Container = styled(View)`
  flex: 1;
  position: relative;
`;
const Header = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(1)};
  margin: ${styles.space(1)};
`;
const HeaderMain = styled(View)`
  flex: 1;
`;
const HeaderRight = styled(View)``;
const SemestersContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  overflow: auto;
  padding-bottom: ${styles.space(1)};

  & > *:first-child {
    margin-left: ${styles.space(1)};
  }
`;
const HorizontalLine = styled.div`
  position: absolute;
  background-color: ${styles.blue};
  height: 0.5rem;
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  width: 100%;
  left: 0;
  bottom: 3rem;
`;
const Navigator = styled.div`
  height: 3rem;
  max-height: 3rem;
  min-height: 3rem;
  background-color: ${styles.grayLighter};
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
`;
const Slider = styled.div`
  position: absolute;
  height: 3rem;
  max-height: 3rem;
  min-height: 3rem;
  background-color: ${styles.blue};
  opacity: 0.25;
  transition: all 0.1s;
`;
const NavigatorHorizontalLine = styled.div`
  height: 0.1rem;
  background-color: ${styles.grayLight};
  position: absolute;
  width: 100%;
  top: 40%;
`;
const NavigationLabel = styled(View)`
  margin-bottom: ${styles.space(-1)};
  position: relative;
`;
const Tick = styled.div`
  height: 0.7rem;
  width: 2px;
  background-color: ${styles.grayLight};
  position: absolute;
  left: 50%;
  top: -170%;
`;

const actions = {
  newSemester: {
    text: 'New semester',
    icon: 'plus',
    color: styles.blue,
  },
};

export class Timeline extends Model.store.connect({
  initialState: {
    sliderWidth: 0,
    sliderLeft: 0,
  },
}) {
  semesterContainerRef: HTMLElement | null | undefined;

  sliderMouseDown$ = new Subject<{ y: number; x: number }>();
  mouseUp$ = new Subject<MouseEvent>();
  mouseUpHandler = this.mouseUp$.next.bind(this.mouseUp$);
  mouseMove$ = new Subject<MouseEvent>();
  mouseMoveHandler = this.mouseMove$.next.bind(this.mouseMove$);

  componentDidMount() {
    document.addEventListener('mouseup', this.mouseUpHandler);
    document.addEventListener('mousemove', this.mouseMoveHandler);

    const drags = this.sliderMouseDown$.pipe(
      map(mousedown =>
        this.mouseMove$.pipe(
          startWith(mousedown),
          map((e: any) => ({ y: e.y || (e.clientY as number), x: e.x || (e.clientX as number) })),
          takeUntil(this.mouseUp$.pipe(take(1))),
        ),
      ),
    );

    drags.subscribe(drag$ => drag$.subscribe(this.handleDrag));
  }

  handleDrag = (e: { y: number; x: number }) => {
    if (!this.semesterContainerRef) return;
    const scrollWidth = this.semesterContainerRef.scrollWidth;
    const clientWidth = this.semesterContainerRef.clientWidth;
    const clientLeft = this.semesterContainerRef.getBoundingClientRect().left;
    this.semesterContainerRef.scrollLeft =
      ((e.x - clientLeft) / (clientWidth - clientLeft)) * scrollWidth - scrollWidth / 2;
  };

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mouseup', this.mouseUpHandler);
    document.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  handleActions = (action: keyof typeof actions) => {
    if (action === 'newSemester') {
      this.setStore(store => store.updatePlan(plan => plan.createNewSemester()));
    }
  };

  handleSemesterContainerRef = (e: HTMLElement | null | undefined) => {
    this.semesterContainerRef = e;
  };

  handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollWidth = (this.semesterContainerRef && this.semesterContainerRef.scrollWidth) || 1;
    const clientWidth = (this.semesterContainerRef && this.semesterContainerRef.clientWidth) || 1;
    const scrollOffset = (this.semesterContainerRef && this.semesterContainerRef.scrollLeft) || 1;

    this.setState(previousState => ({
      ...previousState,
      sliderWidth: clientWidth / scrollWidth * clientWidth,
      sliderLeft: scrollOffset / scrollWidth * clientWidth,
    }));
  };

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.sliderMouseDown$.next({ y: e.clientY, x: e.clientX });
  };

  render() {
    const semestersSorted = this.store.user.plan.semesterMap.valueSeq().sortBy(s => s.position);

    return (
      <Container>
        <Header>
          <HeaderMain>
            <Text strong extraLarge color={styles.textLight}>
              Timeline
            </Text>
            <Text color={styles.textLight}>Create your MPlan here.</Text>
          </HeaderMain>
          <HeaderRight>
            <Text strong color={styles.textLight}>
              Expected Graduation:
            </Text>
            <Text strong large color={styles.textLight}>
              April 2018
            </Text>
          </HeaderRight>
        </Header>
        <SemestersContainer innerRef={this.handleSemesterContainerRef} onScroll={this.handleScroll}>
          {semestersSorted.map(semester => (
            <Semester
              key={semester.id}
              semester={semester}
              degree={this.store.user.degree}
              catalog={this.store.catalog}
            />
          ))}
          <HorizontalLine className="horizontal-line" />
        </SemestersContainer>
        <Navigator>
          <Slider
            style={{ width: this.state.sliderWidth, left: this.state.sliderLeft }}
            onMouseDown={this.handleMouseDown}
          />
          {semestersSorted.map(semester => (
            <NavigationLabel key={semester.id}>
              <Tick />
              <Text small color={styles.gray}>
                {semester.shortName}
              </Text>
            </NavigationLabel>
          ))}
          <NavigatorHorizontalLine />
        </Navigator>
        <FloatingActionButton actions={actions} message="Add..." onAction={this.handleActions} />
      </Container>
    );
  }
}
