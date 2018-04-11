import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Accordion } from './accordion';

const Container = styled(View)`
  box-shadow: ${styles.boxShadow(0)};
  width: 16rem;
  background-color: ${styles.white};
  transition: all 400ms;
  max-width: 16rem;
  z-index: 2;
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin: ${styles.space(0)};
`;
const Body = styled(View)`
  flex: 1;
`;

export class Toolbox extends Model.store.connect({
  initialState: {
    accordionOpenA: false,
    accordionOpenB: false,
  },
}) {
  handleAccordionToggleA = () => {
    this.setState(previousState => ({
      ...previousState,
      accordionOpenA: !previousState.accordionOpenA,
    }));
  };

  handleAccordionToggleB = () => {
    this.setState(previousState => ({
      ...previousState,
      accordionOpenB: !previousState.accordionOpenB,
    }));
  };

  render() {
    return (
      <Container style={{ maxWidth: this.store.ui.showToolbox ? '16rem' : 0 }}>
        <Header>Toolbox</Header>
        <Body>
          <Accordion
            header="Unplaced courses"
            onToggle={this.handleAccordionToggleA}
            open={this.state.accordionOpenA}
          >
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
          </Accordion>
          <Accordion
            header="Unplaced courses"
            onToggle={this.handleAccordionToggleB}
            open={this.state.accordionOpenB}
          >
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
            <Text large>whoa</Text>
          </Accordion>
        </Body>
      </Container>
    );
  }
}
