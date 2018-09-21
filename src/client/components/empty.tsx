import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const Root = styled(View)`
  height: 15rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
`;
const Title = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.grayLight};
`;
const Subtitle = styled(Text)`
  color: ${styles.grayLight};
  font-size: ${styles.space(0)};
`;

interface EmptyProps {
  title?: string;
  subtitle?: string;
}

export class Empty extends React.PureComponent<EmptyProps, {}> {
  render() {
    const { title, subtitle } = this.props;
    return (
      <Root>
        {title && <Title>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Root>
    );
  }
}
