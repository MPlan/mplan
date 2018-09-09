import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { IconButton } from 'components/icon-button';
import { DropdownMenu as _DropdownMenu, Actions } from 'components/dropdown-menu';
import { RightClickMenu } from 'components/right-click-menu';

const Root = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${styles.space(-1)};
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
`;
const Summary = styled(View)`
  margin-right: ${styles.space(-1)};
  flex: 1 1 auto;
`;
const Title = styled(Text)``;
const Details = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${styles.space(-2)};
  & ${Text} {
    text-transform: uppercase;
    margin-right: ${styles.space(-1)};
    font-size: ${styles.space(-1)};
  }
`;
const DropdownMenu = styled(_DropdownMenu)`
  margin-right: ${styles.space(-2)};
`;

const actions: Actions<'view' | 'delete' | 'move' | 'rearrange'> = {
  view: {
    icon: 'pencil',
    text: 'View group',
    color: styles.blue,
  },
  move: {
    icon: 'arrowsH',
    text: 'Change column',
  },
  rearrange: {
    icon: 'bars',
    text: 'Rearrange',
  },
  delete: {
    icon: 'trash',
    text: 'Delete group',
    color: styles.danger,
  },
};

interface CourseGroupProps {
  title: string;
  onClick: () => void;
  courseCount: number;
  creditHours: string;
}

export class CourseGroup extends React.PureComponent<CourseGroupProps, {}> {
  handleActions = (action: keyof typeof actions) => {};

  render() {
    const { title, courseCount, creditHours } = this.props;
    return (
      <RightClickMenu header={title} actions={actions} onAction={this.handleActions}>
        {rightClickProps => (
          <Root {...rightClickProps}>
            <Summary>
              <Title>{title}</Title>
              <Details>
                <Text>{courseCount} Courses</Text>
                <Text>{creditHours}</Text>
              </Details>
            </Summary>
            <DropdownMenu header={title} actions={actions} onAction={this.handleActions} />
            <IconButton>
              <Fa icon="angleRight" />
            </IconButton>
          </Root>
        )}
      </RightClickMenu>
    );
  }
}
