import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text, TextProps } from 'components/text';

const Root = styled(View)`
  height: 15rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
`;
interface TextWithSizeProps extends TextProps {
  size?: 'small' | 'regular' | 'large';
}
const sizeMap = {
  small: 0,
  regular: 1,
  large: 2,
};
const Title = styled<TextWithSizeProps>(Text)`
  font-size: ${props => styles.space(sizeMap[props.size || 'regular'])};
  font-weight: ${styles.bold};
  color: ${styles.grayLight};
`;
const Subtitle = styled<TextWithSizeProps>(Text)`
  color: ${styles.grayLight};
  font-size: ${props => styles.space(sizeMap[props.size || 'regular'] - 1)};
`;

interface EmptyProps {
  title?: string;
  subtitle?: string;
  size?: 'small' | 'regular' | 'large';
}

export class Empty extends React.PureComponent<EmptyProps, {}> {
  render() {
    const { title, subtitle, size } = this.props;
    return (
      <Root>
        {title && <Title size={size}>{title}</Title>}
        {subtitle && <Subtitle size={size}>{subtitle}</Subtitle>}
      </Root>
    );
  }
}
