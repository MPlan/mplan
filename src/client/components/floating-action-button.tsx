import * as React from 'react';
import { View } from './view';
import { Text } from './text';
import { MenuItem } from './menu-item';
import { Fa } from './fa';
import styled, { keyframes } from 'styled-components';
import * as styles from '../styles';

const fadeIn = keyframes`
  0% {
    display: none;
    opacity: 0;
  }
  1% {
    display: block;
    opacity: 0;
  }
  100% {
    display: block;
    opacity: 1;
  }
`;
const Container = styled(View)`
  position: absolute;
  bottom: ${styles.space(3)};
  right: ${styles.space(3)};
  transition: all 0.08s;
  justify-content: center;
  align-items: center;
`;
const VerticalLine = styled.div`
  width: 0.2rem;
  min-width: 0.2rem;
  height: ${styles.space(1)};
  min-height: ${styles.space(1)};
  position: absolute;
  background-color: ${styles.white};
`;
const HorizontalLine = styled.div`
  height: 0.2rem;
  min-height: 0.2rem;
  width: ${styles.space(1)};
  min-width: ${styles.space(1)};
  position: absolute;
  background-color: ${styles.white};
`;
const Plus = styled(View)`
  position: relative;
  justify-content: center;
  align-items: center;
`;
const Message = styled(Text)`
  background-color: initial;
  position: absolute;
  width: 10rem;
  bottom: calc(100% + ${styles.space(0)});
  right: 0;
  text-align: right;
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  display: none;
`;
const Menu = styled.ul`
  list-style-type: none;
  display: none;
  flex-direction: column;
  position: absolute;
  background-color: white;
  width: 20rem;
  bottom: calc(100% + 1rem);
  right: 0;
  margin: 0;
  padding: ${styles.space(-1)} 0;
  text-align: left;
  box-shadow: ${styles.boxShadow(1)};
`;
const Item = styled.li`
  padding: 1rem;
  margin: 0;
  &:hover,
  &:focus {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  outline: none;
`;
const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${styles.blue};
  height: ${styles.space(3)};
  min-height: ${styles.space(3)};
  width: ${styles.space(3)};
  min-width: ${styles.space(3)};
  border-style: none;
  border-radius: 999999px;
  box-shadow: ${styles.boxShadow(1)};
  outline: none;

  &:hover .message {
    opacity: 1;
    animation: ${fadeIn} 0.2s ease-out;
  }

  &:focus,
  &:hover {
    background-color: ${styles.hover(styles.blue)};
  }
  &:active,
  &.item-mouse-down {
    background-color: ${styles.linkHover};
  }
  &:active .message {
    color: ${styles.linkHover};
  }
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  position: absolute;
  bottom: calc(100% + ${styles.space(0)});
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(0)};
  min-width: ${styles.space(0)};
`;

export interface FloatingActionButtonProps<T>
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  message: string;
  actions: T;
  onAction?: (action: keyof T) => void;
}

interface FloatingActionButtonState {
  hovering: boolean;
  open: boolean;
  itemMouseDown: boolean;
}

export class FloatingActionButton<T extends { [P in keyof T]: MenuItem }> extends React.PureComponent<
  FloatingActionButtonProps<T>,
  FloatingActionButtonState
> {
  containerRef = React.createRef<HTMLElement>();
  constructor(props: FloatingActionButtonProps<T>) {
    super(props);
    this.state = {
      hovering: false,
      open: false,
      itemMouseDown: false,
    };
  }

  handleMouseEnter = () => {
    this.setState(previousState => ({
      ...previousState,
      hovering: true,
    }));
  };

  handleMouseLeave = () => {
    this.setState(previousState => ({
      ...previousState,
      hovering: false,
    }));
  };

  handleClick = () => {
    this.setState(previousState => ({
      ...previousState,
      open: !previousState.open,
    }));
  };

  handleMenuClick(action: keyof T) {
    this.props.onAction && this.props.onAction(action);
    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  }

  handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const containerRef = this.containerRef.current;
    if (!containerRef) return;
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget) {
      if (containerRef.contains(relatedTarget)) return;
    }
    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  };

  handleItemMouseDown = () => {
    this.setState(previousState => ({
      ...previousState,
      itemMouseDown: true,
    }));
  };

  handleItemMouseUp = () => {
    this.setState(previousState => ({
      ...previousState,
      itemMouseDown: false,
    }));
  };

  render() {
    const { message, onClick, ref, ...restOfProps } = this.props;

    return (
      <Container innerRef={this.containerRef}>
        <Fab
          className={this.state.itemMouseDown ? 'item-mouse-down' : ''}
          onClick={this.handleClick}
          onBlur={this.handleBlur}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          {...restOfProps}
        >
          <Plus>
            <VerticalLine />
            <HorizontalLine />
          </Plus>
        </Fab>
        <Menu style={{ display: this.state.open ? 'flex' : 'none' }}>
          <Header
            style={{
              display: this.state.open ? 'block' : 'none',
            }}
          >
            {this.props.message}
          </Header>
          {Object.entries(this.props.actions)
            .map(([action, _value]) => {
              const value = _value as MenuItem;
              return {
                action: action as keyof T,
                text: value.text,
                icon: value.icon,
                color: value.color,
              };
            })
            .map(({ action, text, icon, color }) => (
              <Item
                key={action}
                tabIndex={0}
                onClick={() => {
                  this.handleMenuClick(action);
                }}
                onBlur={this.handleBlur}
                onMouseDown={this.handleItemMouseDown}
                onMouseUp={this.handleItemMouseUp}
              >
                <Icon icon={icon} color={color} />
                <Text style={{ color: styles.text }}>{text}</Text>
              </Item>
            ))}
        </Menu>
        <Message
          className="message"
          style={{
            display: this.state.hovering && !this.state.open ? 'block' : 'none',
          }}
        >
          {this.props.message}
        </Message>
      </Container>
    );
  }
}
