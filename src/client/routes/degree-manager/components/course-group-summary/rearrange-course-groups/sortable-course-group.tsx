import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { SortableElement } from 'react-sortable-hoc';
import { IconButton } from 'components/icon-button';
import { Fa } from 'components/fa';

const Root = styled(View)`
  z-index: 1;
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  background-color: white;
  &:hover {
    box-shadow: ${styles.grabbableShadow};
  }
  &:active {
    box-shadow: ${styles.grabbableShadowActive};
    user-select: none;
  }
  padding: ${styles.space(-1)};
  margin-bottom: ${styles.space(-1)};
`;
const Name = styled(Text)`
  margin: 0 ${styles.space(0)};
`;

interface SortableGroupProps {
  name: string;
  column: number;
  onLeft: () => void;
  onRight: () => void;
}

class Group extends React.PureComponent<SortableGroupProps, {}> {
  render() {
    const { name, onLeft, onRight, column } = this.props;
    return (
      <Root>
        <IconButton onClick={onLeft} disabled={column === 1}>
          <Fa icon="arrowLeft" />
        </IconButton>
        <Name>{name}</Name>
        <IconButton onClick={onRight} disabled={column === 3}>
          <Fa icon="arrowRight" />
        </IconButton>
      </Root>
    );
  }
}

export const SortableGroup = SortableElement<SortableGroupProps>(props => <Group {...props} />);
