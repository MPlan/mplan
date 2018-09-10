import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text, TextProps } from 'components/text';

const Root = styled(View)``;

interface CaptionProps extends TextProps {
  focused?: boolean;
}
const Caption = styled<CaptionProps>(Text)`
  font-size: ${styles.space(-1)};
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: ${styles.space(-2)};
  color: ${props => (props.focused ? styles.blue : styles.textLight)};
  transition: all 200ms;
`;

interface FieldProps {
  focused: boolean;
  label: string;
}

export class Field extends React.Component<FieldProps, {}> {
  render() {
    const { focused, label, children, ...restOfProps } = this.props;
    return (
      <Root {...restOfProps}>
        <Caption focused={focused}>{label}</Caption>
        {children}
      </Root>
    );
  }
}
