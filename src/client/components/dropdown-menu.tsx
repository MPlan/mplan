import * as React from 'react';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import { Fa } from './fa';
import * as styles from '../styles';
import { wait } from '../../utilities/utilities';

const Container = styled(View)`
  position: relative;
`;
const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: 0;
  padding: 0;
  background-color: ${styles.white};
  list-style-type: none;
  box-shadow: ${styles.boxShadow(-1)};
  top: 100%;
  right: 0;
  min-width: 10rem;
  width: 10rem;
  z-index: 50;
`;
const Item = styled.li`
  margin: 0;
  padding: ${styles.space(-1)} ${styles.space(0)};
  outline: none;
  &:focus,
  &.focus {
    background-color: ${styles.whiteTer};
  }
  &:active,
  &.active {
    background-color: ${styles.grayLighter};
  }
`;
const SelectedItem = styled(Item)``;
const EllipsisButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${styles.space(1)};
  height: ${styles.space(1)};
  border-radius: 99999px;
  outline: none;
  border: none;
  margin-top: 0.2rem;
  &:hover,
  &:focus {
    color: ${styles.blue};
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 0.2;
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(0)};
`;

interface Item {
  text: string;
  icon: string;
  color?: string;
}

export interface DropdownMenuProps<T extends { [P in keyof T]: Item }> {
  actions: T;
  onEllipsisClick?: () => void;
  onAction?: (action: keyof T) => void;
}

interface DropdownMenuState<T extends { [P in keyof T]: Item }> {
  currentAction: keyof T | undefined;
  open: boolean;
  spaceDown: boolean;
}

export class DropdownMenu<T extends { [P in keyof T]: Item }> extends React.Component<
  DropdownMenuProps<T>,
  DropdownMenuState<T>
> {
  containerElement: HTMLElement | undefined;

  constructor(props: DropdownMenuProps<T>) {
    super(props);

    this.state = {
      currentAction: undefined,
      open: false,
      spaceDown: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keyup', this.handleKeyup);
  }

  get actions() {
    return Object.keys(this.props.actions) as Array<keyof T>;
  }

  get currentActionIndex() {
    return this.actions.findIndex(action => action === this.state.currentAction);
  }

  handleKeydown = (e: KeyboardEvent) => {
    if (!this.state.open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.setState(previousState => ({
        ...previousState,
        open: false,
        currentAction: undefined,
      }));
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this.state.currentAction) {
        this.setState(previousState => ({
          ...previousState,
          currentAction: this.actions[0],
        }));
        return;
      }
      this.setState(previousState => ({
        ...previousState,
        currentAction: this.actions[Math.min(this.currentActionIndex + 1, this.actions.length - 1)],
      }));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.state.currentAction) {
        this.setState(previousState => ({
          ...previousState,
          currentAction: this.actions[0],
        }));
        return;
      }
      this.setState(previousState => ({
        ...previousState,
        currentAction: this.actions[Math.max(this.currentActionIndex - 1, 0)],
      }));
      return;
    }

    if (e.key === ' ') {
      this.setState(previousState => ({
        ...previousState,
        spaceDown: true,
      }));
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleAction(this.state.currentAction);
      return;
    }
  };

  handleKeyup = (e: KeyboardEvent) => {
    if (!this.state.open) return;
    if (e.key === 'Enter') return;
    if (e.key === ' ') {
      this.handleAction(this.state.currentAction);
      this.setState(previousState => ({
        ...previousState,
        spaceDown: false,
      }));
      return;
    }
  };

  handleEllipsisClick = () => {
    this.props.onEllipsisClick && this.props.onEllipsisClick();
    this.setState(previousState => ({
      ...previousState,
      open: !previousState.open,
    }));
  };

  handleActionFocus(action: keyof T) {
    if (!this.state.open) return;

    this.setState(previousState => ({
      ...previousState,
      currentAction: action,
    }));
  }

  handleAction(action: keyof T | undefined) {
    this.setState(previousState => ({
      ...previousState,
      currentAction: undefined,
      open: false,
    }));

    if (!action) return;
    this.props.onAction && this.props.onAction(action);
  }

  handleEllipsisBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    const containerElement = this.containerElement;
    if (!containerElement) return;

    const relatedTarget = e.relatedTarget as any;

    if (containerElement.contains(relatedTarget)) return;

    this.setState(previousState => ({
      ...previousState,
      currentAction: undefined,
      open: false,
    }));
  };

  handleContainerRef = (e: HTMLElement | undefined) => {
    this.containerElement = e;
  };

  render() {
    return (
      <Container innerRef={this.handleContainerRef}>
        <EllipsisButton onClick={this.handleEllipsisClick} onBlur={this.handleEllipsisBlur}>
          <Fa icon="ellipsisV" />
        </EllipsisButton>
        <Menu style={{ display: this.state.open ? 'flex' : 'none' }}>
          {Object.keys(this.props.actions)
            .map(key => key as keyof T)
            .map(key => ({
              action: key,
              text: this.props.actions[key].text,
              icon: this.props.actions[key].icon,
              color: this.props.actions[key].color,
            }))
            .map(({ action, text, icon, color }) => {
              return (
                <Item
                  key={action}
                  tabIndex={0}
                  onClick={() => this.handleAction(action)}
                  onMouseEnter={() => this.handleActionFocus(action)}
                  onFocus={() => this.handleActionFocus(action)}
                  className={
                    this.state.currentAction === action
                      ? this.state.spaceDown ? 'focus active' : 'focus'
                      : ''
                  }
                >
                  <Icon icon={icon} color={color} />
                  <Text>{text}</Text>
                </Item>
              );
            })}
        </Menu>
      </Container>
    );
  }
}
