import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const Root = styled(View)`
  padding: ${styles.space(-1)};
`;
const Name = styled(Text)``;

interface DegreeListItemProps {
  masteredDegree: Model.MasteredDegree.Model;
  onClick: () => void;
}

export class DegreeListItem extends React.PureComponent<DegreeListItemProps, {}> {
  render() {
    const { masteredDegree, onClick } = this.props;
    return (
      <Root onClick={onClick}>
        <Name>{masteredDegree.name}</Name>
      </Root>
    );
  }
}
