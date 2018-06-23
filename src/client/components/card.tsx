import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';

const Container = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
`;

export class Card extends React.PureComponent<{}, {}> {
  render() {
    return <Container>{this.props.children}</Container>;
  }
}
