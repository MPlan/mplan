import * as React from 'react';
import { View, Text, Semester, FloatingActionButton } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import { allCombinations } from '../models';

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

const actions = {
  newSemester: {
    text: 'New semester',
    icon: 'plus',
    color: styles.blue,
  },
};

export class Timeline extends Model.store.connect() {
  handleActions = (action: keyof typeof actions) => {
    if (action === 'newSemester') {
      this.setStore(store => store.updatePlan(plan => plan.createNewSemester()));
    }
  };

  render() {
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
        <SemestersContainer>
          {this.store.user.plan.semesterMap
            .valueSeq()
            .sortBy(s => s.position)
            .map(semester => (
              <Semester
                key={semester.id}
                semester={semester}
                degree={this.store.user.degree}
                catalog={this.store.catalog}
              />
            ))}
        </SemestersContainer>
        <FloatingActionButton actions={actions} message="Add..." onAction={this.handleActions} />
      </Container>
    );
  }
}
