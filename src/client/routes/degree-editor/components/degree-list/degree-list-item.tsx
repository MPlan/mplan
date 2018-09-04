import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';

const Root = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  padding: ${styles.space(0)} ${styles.space(1)};
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 200ms;
`;
const Name = styled(Text)`
  flex: 1 1 auto;
`;

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
        <Fa icon="angleRight" />
      </Root>
    );
  }
}
