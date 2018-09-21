import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';

const Root = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
`;
const Description = styled(View)`
  flex: 1 1 calc(70% - ${styles.space(0)});
  margin-right: ${styles.space(0)};
`;
interface ActionProps extends ViewProps {
  stretchAction?: boolean;
}
const Action = styled<ActionProps>(View)`
  ${props => (props.stretchAction ? '' : 'align-self: center;')} flex: 1 1 30%;
`;

interface DescriptionActionProps {
  description: React.ReactNode;
  children: any;
  stretchAction?: boolean;
}

export class DescriptionAction extends React.Component<DescriptionActionProps, {}> {
  render() {
    const { description, children, stretchAction } = this.props;
    return (
      <Root>
        <Description>{description}</Description>
        <Action stretchAction={stretchAction}>{children}</Action>
      </Root>
    );
  }
}
