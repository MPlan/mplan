import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { Fa } from 'components/fa';
import { MenuItem } from 'components/menu-item';
import { ClickAwayListener } from 'components/click-away-listener';

const Root = styled(View)`
  position: absolute;
  right: ${styles.space(1)};
  top: 0;
  box-shadow: ${styles.boxShadow(-1)};
  padding: ${styles.space(0)} 0;
  background-color: ${styles.white};
  width: 15rem;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 ${styles.space(0)};
`;
const ButtonFa = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const Actions = styled(View)`
  transition: all 200ms;
  overflow: hidden;
`;
const Action = styled(View)`
  flex-direction: row;
  &:hover,
  &:focus {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  height: 3rem;
  padding: 0 ${styles.space(0)};
  align-items: center;
  transition: all 200ms;
`;

interface ActionMenuProps<T extends { [key: string]: MenuItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
}
interface ActionMenuState {
  open: boolean;
}

export class ActionMenu<T extends { [key: string]: MenuItem }> extends React.PureComponent<
  ActionMenuProps<T>,
  ActionMenuState
> {
  constructor(props: ActionMenuProps<T>) {
    super(props);
    this.state = {
      open: false,
    };
  }

  menuItems() {
    const { actions } = this.props;
    return Object.entries(actions).map(([key, menuItem]) => ({ key, ...menuItem }));
  }

  handleToggleOpen = () => {
    this.setState(previousState => ({ open: !previousState.open }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOnAction(key: keyof T) {
    this.props.onAction(key);
    this.handleClose();
  }

  render() {
    const { open } = this.state;
    const menuItems = this.menuItems();
    return (
      <ClickAwayListener onClickAway={this.handleClose}>
        <Root>
          <Actions
            style={{
              height: open ? `${menuItems.length * 3 + 1}rem` : 0,
              opacity: open ? 1 : 0,
            }}
          >
            {menuItems.map(({ key, color, icon, text }) => (
              <Action key={key} onClick={() => this.handleOnAction(key)}>
                <ButtonFa color={color} icon={icon} />
                <Text>{text}</Text>
              </Action>
            ))}
          </Actions>
          <ButtonRow>
            <PrimaryButton onClick={this.handleToggleOpen}>
              {open ? <ButtonFa icon="angleUp" /> : <ButtonFa icon="angleDown" />}
              {open ? 'Done' : 'Actions Menu'}
            </PrimaryButton>
          </ButtonRow>
        </Root>
      </ClickAwayListener>
    );
  }
}
