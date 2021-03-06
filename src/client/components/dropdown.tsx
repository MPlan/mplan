import * as React from 'react';
import * as styles from 'styles';

import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { MenuItem } from 'components/menu-item';
import { Link as _ReactRouterLink } from 'react-router-dom';

const ReactRouterLink = styled(_ReactRouterLink)`
  color: inherit;
`;
const Container = styled(View)`
  position: relative;
  color: ${styles.text};
  & ${Text} {
    color: ${styles.text};
  }
`;
const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: 0;
  padding: 0;
  background-color: ${styles.white};
  list-style-type: none;
  box-shadow: 0 0.3rem 1rem 0 rgba(12, 0, 51, 0.2);
  top: 100%;
  right: 0;
  max-width: 12rem;
  width: 12rem;
  z-index: 50;
`;
const Item = styled.li`
  display: flex;
  align-items: center;
  margin: 0;
  padding: ${styles.space(-1)} ${styles.space(0)};
  outline: none;
  cursor: pointer;
  &:focus,
  &.focus {
    background-color: ${styles.whiteTer};
  }
  &:active,
  &.active {
    background-color: ${styles.grayLighter};
  }
`;
const Header = styled.li`
  margin: 0;
  padding: ${styles.space(-1)} ${styles.space(0)};
  outline: none;
  border-bottom: solid ${styles.borderWidth} ${styles.grayLighter};
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(0)};
  min-width: ${styles.space(0)};
`;

export interface DropdownProps<T extends { [P in keyof T]: MenuItem }> {
  open: boolean;
  onBlur: () => void;
  header: string;
  actions: T;
  onAction?: (action: keyof T) => void;
}

export interface DropdownState<T extends { [P in keyof T]: MenuItem }> {
  currentAction: keyof T | undefined;
  spaceDown: boolean;
}

export class Dropdown<T extends { [P in keyof T]: MenuItem }> extends React.PureComponent<
  DropdownProps<T>,
  DropdownState<T>
> {
  containerRef = React.createRef<HTMLElement>();

  constructor(props: DropdownProps<T>) {
    super(props);
    this.state = {
      currentAction: undefined,
      spaceDown: false,
    };
  }
  get actions() {
    return Object.keys(this.props.actions) as Array<keyof T>;
  }

  get currentActionIndex() {
    return this.actions.findIndex(action => action === this.state.currentAction);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keyup', this.handleKeyup);
  }

  handleKeydown = (e: KeyboardEvent) => {
    if (!this.props.open) return;

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
      e.preventDefault();
      this.setState(previousState => ({
        ...previousState,
        spaceDown: true,
      }));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleAction(this.state.currentAction);
      return;
    }
  };

  handleKeyup = (e: KeyboardEvent) => {
    if (!this.props.open) return;
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

  handleActionFocus(action: keyof T) {
    if (!this.props.open) return;

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

    this.props.onBlur();
    if (!action) return;
    this.props.onAction && this.props.onAction(action);
  }

  handleActionBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      currentAction: undefined,
    }));
  };

  handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const containerElement = this.containerRef.current;
    if (!containerElement) return;

    const relatedTarget = e.relatedTarget as any;

    if (containerElement.contains(relatedTarget)) return;

    this.props.onBlur();
    this.setState(previousState => ({
      ...previousState,
      currentAction: undefined,
    }));
  };

  render() {
    return (
      <Container innerRef={this.containerRef} onBlur={this.handleContainerBlur}>
        <Menu className="menu" style={{ display: this.props.open ? 'flex' : 'none' }}>
          <Header>
            <Text style={{ color: styles.text }} strong>
              {this.props.header}
            </Text>
          </Header>
          {Object.keys(this.props.actions)
            .map(key => key as keyof T)
            .map(key => ({
              action: key,
              text: this.props.actions[key].text,
              icon: this.props.actions[key].icon,
              color: this.props.actions[key].color,
              link: this.props.actions[key].link,
            }))
            .map(({ action, text, icon, color, link }) => {
              const Link = (link ? ReactRouterLink : 'div') as any;
              return (
                <Link to={link}>
                  <Item
                    key={action.toString()}
                    tabIndex={0}
                    onClick={() => this.handleAction(action)}
                    onMouseEnter={() => this.handleActionFocus(action)}
                    onMouseLeave={() => this.handleActionBlur()}
                    onFocus={() => this.handleActionFocus(action)}
                    className={
                      this.state.currentAction === action
                        ? this.state.spaceDown
                          ? 'focus active'
                          : 'focus'
                        : ''
                    }
                  >
                    <Icon icon={icon} color={color} />
                    <Text style={{ color: styles.text }}>{text}</Text>
                  </Item>
                </Link>
              );
            })}
        </Menu>
      </Container>
    );
  }
}
