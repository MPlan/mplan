import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import * as pluralize from 'pluralize';

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
  transition: all 200ms;
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

const actions: Actions<'view' | 'delete' | 'rearrange'> = {
  view: {
    icon: 'pencil',
    text: 'View group',
    color: styles.blue,
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

interface RequirementGroupProps {
  name: string;
  onClick: () => void;
  onRearrange: () => void;
  onDelete: () => void;
  creditMinimum: number;
  creditMaximum: number;
}

export class RequirementGroup extends React.PureComponent<RequirementGroupProps, {}> {
  dropdownMenuRef = React.createRef<HTMLElement>();

  handleActions = (action: keyof typeof actions) => {
    const { onClick, onRearrange, onDelete } = this.props;
    if (action === 'view') {
      onClick();
      return;
    }

    if (action === 'rearrange') {
      onRearrange();
      return;
    }

    if (action === 'delete') {
      onDelete();
      return;
    }
  };

  get creditHours() {
    const { creditMaximum, creditMinimum } = this.props;
    if (creditMinimum === creditMaximum) {
      return `${creditMinimum} ${pluralize('credits', creditMinimum)}`;
    }

    return `${creditMinimum} - ${creditMaximum} credits`;
  }

  handleClick = (e: React.MouseEvent<any>) => {
    const { onClick } = this.props;

    const dropdownMenuElement = this.dropdownMenuRef.current;
    if (!dropdownMenuElement) {
      onClick();
      return;
    }

    if (dropdownMenuElement.contains(e.target as any)) return;

    onClick();
  };

  render() {
    const { name } = this.props;
    return (
      <RightClickMenu header={name} actions={actions} onAction={this.handleActions}>
        {rightClickProps => (
          <Root onClick={this.handleClick} {...rightClickProps}>
            <Summary>
              <Title>{name}</Title>
              <Details>
                <Text>{this.creditHours}</Text>
              </Details>
            </Summary>
            <DropdownMenu
              containerRef={this.dropdownMenuRef}
              header={name}
              actions={actions}
              onAction={this.handleActions}
            />
            <IconButton>
              <Fa icon="angleRight" />
            </IconButton>
          </Root>
        )}
      </RightClickMenu>
    );
  }
}
