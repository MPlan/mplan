import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(0)};
`;
const Key = styled(Text)`
  font-weight: bold;
  margin-right: ${styles.space(-1)};
  min-width: 10rem;
`;
const Value = styled(Text)`
`;

interface KeyValueProps {
  title: string;
  value: string | number;
}

export class KeyValue extends React.PureComponent<KeyValueProps, {}> {
  render() {
    return (
      <Container>
        <Key>{this.props.title}:</Key>
        <Value>{this.props.value}</Value>
      </Container>
    );
  }
}
