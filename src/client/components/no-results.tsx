import * as React from 'react';
import * as styles from '../styles';
import styled from 'styled-components';

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
const Title = styled(Text)`
  margin-top: ${styles.space(1)};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  flex-direction: row;
  color: ${styles.grayLight};
`;
const Subtitle = styled(Text)`
  font-size: ${styles.space(1)};
  color: ${styles.grayLight};
`;

interface NoResultsProps {
  query: string;
}

export class NoResults extends React.PureComponent<NoResultsProps, {}> {
  render() {
    const { query } = this.props;
    return (
      <Container>
        <Box>
          <Title>Oh no!</Title>
          <Subtitle>We couldn't find for "{query}"</Subtitle>
        </Box>
      </Container>
    );
  }
}
