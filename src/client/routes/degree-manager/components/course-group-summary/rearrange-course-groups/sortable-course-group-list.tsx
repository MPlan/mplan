import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { CourseGroupViewModel } from './rearrange-course-groups';

import { SortableContainer } from 'react-sortable-hoc';
import { View } from 'components/view';
import { SortableCourseGroup } from './sortable-course-group';

const Root = styled(View)`
  & > * {
    flex: 0 0 auto;
  }
`;

interface SortableCourseGroupListProps {
  groups: CourseGroupViewModel[];
  onLeft: (groupId: string) => void;
  onRight: (groupId: string) => void;
}

class CourseGroupList extends React.PureComponent<SortableCourseGroupListProps, {}> {
  render() {
    const { groups, onRight, onLeft } = this.props;
    return (
      <Root>
        {groups.map((group, index) => (
          <SortableCourseGroup
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

export const SortableCourseGroupList = SortableContainer<SortableCourseGroupListProps>(props => (
  <CourseGroupList {...props} />
));
