import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Page } from 'components/page';
import { Text } from 'components/text';

interface DegreeProps {
  degreeName: string;
}
interface DegreeState {}

export class Degree extends React.PureComponent<DegreeProps, DegreeState> {
  render() {
    const { degreeName } = this.props;
    return (
      <Page title={degreeName}>
        <Text>Test degree</Text>
      </Page>
    );
  }
}
