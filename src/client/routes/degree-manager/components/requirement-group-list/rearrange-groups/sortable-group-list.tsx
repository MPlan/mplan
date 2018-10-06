import * as React from 'react';
import styled from 'styled-components';
import { GroupViewModel } from './rearrange-groups';

import { SortableContainer } from 'react-sortable-hoc';
import { View } from 'components/view';
import { SortableGroup } from './sortable-group';

const Root = styled(View)`
  & > * {
    flex: 0 0 auto;
  }
`;

interface SortableGroupListProps {
  groups: GroupViewModel[];
  onLeft: (groupId: string) => void;
  onRight: (groupId: string) => void;
}

class GroupList extends React.PureComponent<SortableGroupListProps, {}> {
  render() {
    const { groups, onRight, onLeft } = this.props;
    return (
      <Root>
        {groups.map((group, index) => (
          <SortableGroup
            key={group.id}
            index={index}
            name={group.name}
            column={group.column}
            onLeft={() => onLeft(group.id)}
            onRight={() => onRight(group.id)}
          />
        ))}
      </Root>
    );
  }
}

export const SortableGroupList = SortableContainer<SortableGroupListProps>(props => (
  <GroupList {...props} />
));
