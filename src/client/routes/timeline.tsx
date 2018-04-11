import * as React from 'react';
import { View, Text, Semester, FloatingActionButton, Button, Toolbox } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import { allCombinations } from '../models';
import { parseToRgb } from 'polished';

const rgbaBlue = parseToRgb(styles.blue);

const Container = styled(View)`
  flex-direction: row;
  flex: 1;
`;
const Content = styled(View)`
  flex: 1;
  position: relative;
  overflow: auto;
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
    height: ${styles.space(1)};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${styles.blue};
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    top: 100%;
  }
`;
const Navigator = styled.div`
  background-color: ${styles.grayLighter};
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
`;
const NavigationLabel = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${styles.gray};
  font-size: ${styles.space(-1)};
  cursor: pointer;
  position: relative;
  flex: 1;
  &:hover {
    text-decoration: underline;
    color: ${styles.hover(styles.gray)};
    background-color: ${styles.hover(styles.grayLight)};
  }
  &:active {
    color: ${styles.active(styles.gray)};
    background-color: ${styles.active(styles.grayLight)};
  }
  padding: ${styles.space(-1)};
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
    console.log('got here');
    semesterElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleGenerateButton = () => {
    this.setStore(store => {
      const newPlan = store.user.degree.generatePlan(store.catalog);
      return store.updatePlan(() => newPlan);
    });
  };

  render() {
    const semestersSorted = this.store.user.plan.semesterMap.valueSeq().sortBy(s => s.position);

    return (
      <Container>
        <Content>
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
          <SemestersContainer className="semesters-container">
            {semestersSorted.map(semester => (
              <Semester
                key={semester.id}
                semester={semester}
                degree={this.store.user.degree}
                catalog={this.store.catalog}
              />
            ))}
          </SemestersContainer>
          <Navigator>
            {semestersSorted.map(semester => (
              <NavigationLabel
                key={semester.id}
                onClick={() => this.handleNavigationClick(semester)}
              >
                {semester.shortName}
              </NavigationLabel>
            ))}
          </Navigator>
          <FloatingActionButton actions={actions} message="Add..." onAction={this.handleActions} />
        </Content>
        <Toolbox />
      </Container>
    );
  }
}
