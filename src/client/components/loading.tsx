import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { range } from 'lodash';
import { wait } from '../../utilities/utilities';

import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';

const Container = styled(View)`
  display: flex;
  flex: 1 1 auto;
`;
const Box = styled(View)`
  margin: auto;
  align-items: center;
`;
const Row = styled(View)`
  margin-top: ${styles.space(1)};
  flex-direction: row;
`;
const LoadingText = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  flex-direction: row;
  color: ${styles.textLight};
`;
const LoadingSubText = styled(Text)`
  margin-top: ${styles.space(-1)};
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
`;
const LoadingDots = styled(View)`
  min-width: 3rem;
`;

export class Loading extends React.Component<{}, { dots: number }> {
  state = {
    dots: 0,
  };

  dotsMoving = true;

  get dotsString() {
    return range(this.state.dots + 1)
      .map(() => '.')
      .join('');
  }

  async componentDidMount() {
    while (this.dotsMoving) {
      await wait(200);
      this.setState(previousState => ({
        ...previousState,
        dots: (previousState.dots + 1) % 3,
      }));
    }
  }

  componentWillUnmount() {
    this.dotsMoving = false;
  }

  render() {
    return (
      <Container>
        <Box>
          <Fa icon="spinner" pulse size="5x" color={styles.textLight} />
          <Row>
            <LoadingText>Loading</LoadingText>
            <LoadingDots>
              <LoadingText>{this.dotsString}</LoadingText>
            </LoadingDots>
          </Row>
          <LoadingSubText>We'll be right with you.</LoadingSubText>
        </Box>
      </Container>
    );
  }
}
