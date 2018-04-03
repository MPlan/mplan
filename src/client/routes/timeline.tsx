import * as React from 'react';
import { View, Text } from '../components';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
  position: relative;
`;

const Header = styled(View)`
  padding: ${styles.space(0)};
  flex-direction: row;
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View)``;

const SemesterBlockContainer = styled(View)`
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

        <SemesterBlockContainer />
      </Container>
    );
  }
}
