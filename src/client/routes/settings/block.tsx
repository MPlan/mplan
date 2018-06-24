import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { Card } from 'components/card';
import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)`
  margin-bottom: ${styles.space(0)};
  max-width: 30rem;
  flex: 0 0 auto;
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const Body = styled(View)``;

interface BlockProps {
  title: string;
}

export class Block extends React.PureComponent<BlockProps, {}> {
  render() {
    return (
      <Container>
        <Title>{this.props.title}</Title>
        <Card>
          <Body>{this.props.children}</Body>
        </Card>
      </Container>
    );
  }
}
