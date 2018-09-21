import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';

const Root = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
`;
const Description = styled(View)`
  flex: 1 1 calc(70% - ${styles.space(0)});
  margin-right: ${styles.space(0)};
`;
const Action = styled(View)`
  flex: 1 1 30%;
`;

interface DescriptionActionProps {
  description: React.ReactNode;
  children: any;
}

export class DescriptionAction extends React.Component<DescriptionActionProps, {}> {
  render() {
    const { description, children } = this.props;
    return (
      <Root>
        <Description>{description}</Description>
        <Action>{children}</Action>
      </Root>
    );
  }
}
