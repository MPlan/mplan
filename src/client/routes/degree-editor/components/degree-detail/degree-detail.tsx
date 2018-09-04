import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';

import { View } from 'components/view';

const Root = styled(View)``;

interface DegreeDetailProps {
  masteredDegree: Model.MasteredDegree.Model;
}

export class DegreeDetail extends React.PureComponent<DegreeDetailProps, {}> {
  render() {
    return <Root>Degree Detail</Root>;
  }
}
