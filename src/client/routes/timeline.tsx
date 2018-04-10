import * as React from 'react';
import { View, Text, Semester, FloatingActionButton, Button } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import { allCombinations } from '../models';
import { parseToRgb } from 'polished';

const rgbaBlue = parseToRgb(styles.blue);

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
  overflow-y: auto;
  overflow-x: scroll;
  padding-bottom: ${styles.space(1)};

  & > *:first-child {
    margin-left: ${styles.space(1)};
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: ${styles.space(0)};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgb(${rgbaBlue.red}, ${rgbaBlue.green}, ${rgbaBlue.blue}, 0.25);
    opacity: 0.25;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    top: 100%;
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
  bottom: 4rem;
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
  top: 50%;
`;
const NavigationLabel = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${styles.space(-1)};
  position: relative;
  color: ${styles.gray};
  font-size: ${styles.space(-1)};
  cursor: pointer;
  position: relative;
  flex: 1;
  &:hover {
    text-decoration: underline;
  }
  height: 3rem;

  &::after {
    /* TODO: add tick mark */
  }
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

  handleActions = (action: keyof typeof actions) => {
    if (action === 'newSemester') {
      this.setStore(store => store.updatePlan(plan => plan.createNewSemester()));
    }
  };

  handleNavigationClick(semester: Model.Semester) {
    const semesterElement = document.querySelector(`.semester-${semester.id}`);
    if (!semesterElement) return;
    console.log('got here')
    semesterElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleGenerateButton = () => {
    this.setStore(store => {
      const newPlan = store.user.degree.generatePlan(store.catalog);
      return store.updatePlan(() => newPlan);
    });
  }

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
            <Button onClick={this.handleGenerateButton}>Generate schedule</Button>
          </HeaderRight>
        </Header>
        <SemestersContainer>
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
          {semestersSorted.map(semester => (
            <NavigationLabel key={semester.id} onClick={() => this.handleNavigationClick(semester)}>
              {semester.shortName}
            </NavigationLabel>
          ))}
          <NavigatorHorizontalLine />
        </Navigator>
        <FloatingActionButton actions={actions} message="Add..." onAction={this.handleActions} />
      </Container>
    );
  }
}
