import * as React from 'react';
import * as Model from '../models';
import { View, Text, ActionableText } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)`
  padding: ${styles.space(1)};
`;

const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;

const HeaderMain = styled(View)`
  flex: 1;
`;

const HeaderRight = styled(View) `
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

export class Degree extends Model.store.connect() {
  render() {
    return (
      <Container>
        <Header>
          <HeaderMain>
            <Major>Software Engineering</Major>
            <Disclaimer>
              <Underline>Disclaimer:</Underline> This page is{' '}
              <Underline>not</Underline> a degree audit and should not be
              treated like one.{' '}
              <ActionableText>Click here for more info.</ActionableText>
            </Disclaimer>
          </HeaderMain>
          <HeaderRight>
            <Credits>90/120 credits</Credits>
            <Percentage>75% complete</Percentage>
          </HeaderRight>
        </Header>
      </Container>
    );
  }
}
