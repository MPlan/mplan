import * as React from 'react';
import { View, Text, Semester, FloatingActionButton } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';

const Container = styled(View)`
  flex: 1;
  position: relative;
  padding: ${styles.space(1)};
`;

const Header = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(1)};
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View)``;

const SemestersContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  overflow: auto;
`;

export class Timeline extends Model.store.connect() {
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
            .reverse()
            .map(semester => (
              <Semester
                key={semester.id}
                semester={semester}
                degree={this.store.user.degree}
                catalog={this.store.catalog}
              />
            ))}
        </SemestersContainer>

        <FloatingActionButton actions={{ one: 'test' }} message="Add..." />
      </Container>
    );
  }
}
