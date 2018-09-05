import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';

const Root = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  align-items: center;
`;
const Description = styled(View)`
  width: 50rem;
  max-width: 70%;
  margin-right: ${styles.space(0)};
`;
const Action = styled(View)`
  flex: 1 1 auto;
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
