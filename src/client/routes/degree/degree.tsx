import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Degree } from 'components/degree';

import { RouteComponentProps } from 'react-router';

const Root = styled(View)``;
interface DegreePageProps extends RouteComponentProps<any> {
  degreeName: string;
}

export class DegreePage extends React.PureComponent<DegreePageProps> {
  render() {
    const {} = this.props;
    return (
      <Root>
        <Degree />
      </Root>
    );
  }
}
