import * as React from 'react';
import * as Model from '../models';
import { View, Text, ActionableText, FloatingActionButton, DegreeGroup } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)`
  padding: ${styles.space(1)};
  overflow: auto;
  flex: 1;
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(1)};
  flex-shrink: 0;
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View)`
  align-items: flex-end;
`;

const Major = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;

const Disclaimer = styled(Text)`
  color: ${styles.textLight};
`;

const Underline = styled(Text)`
  text-decoration: underline;
  color: ${styles.textLight};
`;

const Credits = styled(Text)`
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  margin-bottom: ${styles.space(-1)};
`;

const Percentage = styled(Text)`
  color: ${styles.textLight};
`;

const DegreeGroupContainer = styled(View)`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  margin-right: -${styles.space(2)};
  margin-bottom: -${styles.space(2)};
`;

const fabActions = {
  group: 'New course group',
  course: 'Course to existing group',
};

export class Degree extends Model.store.connect() {
  handleFab = (action: keyof typeof fabActions) => {
    if (action === 'group') {
      this.setStore(store =>
        store.updateUser(user =>
          user.addDegreeGroup(
            new Model.DegreeGroup({
              name: 'New Group',
              description: 'Custom group',
            }),
          ),
        ),
      );
    }
  };

  handleDegreeGroupNameChange(degreeGroup: Model.DegreeGroup, newName: string) {
    this.setStore(store =>
      store.updateUser(user =>
        user.updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.set('name', newName)),
      ),
    );
  }

  render() {
    return (
      <Container>
        <Header>
          <HeaderMain>
            <Major>Software Engineering</Major>
            <Disclaimer>
              <Underline>Disclaimer:</Underline> This page is <Underline>not</Underline> a degree
              audit and should not be treated like one.{' '}
              <ActionableText>Click here for more info.</ActionableText>
            </Disclaimer>
          </HeaderMain>
          <HeaderRight>
            <Credits>90/120 credits</Credits>
            <Percentage>75% complete</Percentage>
          </HeaderRight>
        </Header>
        <DegreeGroupContainer>
          {this.store.user.degreeGroups.map(group => (
            <DegreeGroup
              key={group.id}
              degreeGroup={group}
              onNameChange={newName => this.handleDegreeGroupNameChange(group, newName)}
            />
          ))}
        </DegreeGroupContainer>
        <FloatingActionButton message="Add…" actions={fabActions} onAction={this.handleFab} />
      </Container>
    );
  }
}
