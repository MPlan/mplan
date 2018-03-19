import * as React from 'react';
import { View } from './view';
import { Text } from './text';
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

const Container = styled.button`
  display: flex;
  background-color: ${styles.blue};
  height: ${styles.space(3)};
  min-height: ${styles.space(3)};
  width: ${styles.space(3)};
  min-width: ${styles.space(3)};
  border-style: none;
  border-radius: 999999px;
  box-shadow: ${styles.boxShadow(1)};
  outline: none;
  transition: all 0.08s;
  position: absolute;
  bottom: ${styles.space(3)};
  right: ${styles.space(3)};
  justify-content: center;
  align-items: center;

  &:hover .message {
    opacity: 1;
    animation: ${fadeIn} 0.1s ease-out;
  }

  &:focus,
  &:hover {
    background-color: ${styles.hover(styles.blue)};
  }
  &:active {
    background-color: ${styles.linkHover};
  }
  &:active .message {
    color: ${styles.linkHover};
  }
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

const Menu = styled(View)`
  background-color: white;
  box-shadow: ${styles.boxShadow(1)};
  position: absolute;
  width: 20rem;
  bottom: calc(100% + 1rem);
  right: 0;
  display: none;
  margin: 0;
  padding: ${styles.space(0)};
  text-align: left;
`;

const MenuItem = styled(Text)`
  padding: 1rem;
  &:hover {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
`;

const MenuHeader = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  position: absolute;
  bottom: calc(100% + ${styles.space(0)});
`;

export interface FloatingActionButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
  message: string;
  actions: string[];
}

interface FloatingActionButtonState {
  hovering: boolean;
  open: boolean;
}

export class FloatingActionButton extends React.Component<
  FloatingActionButtonProps,
  FloatingActionButtonState
> {
  constructor(props: FloatingActionButtonProps) {
    super(props);
    this.state = {
      hovering: false,
      open: false
    };
  }

  handleMouseEnter = () => {
    this.setState(previousState => ({
      ...previousState,
      hovering: true
    }));
  };

  handleMouseLeave = () => {
    this.setState(previousState => ({
      ...previousState,
      hovering: false
    }));
  };

  handleClick = () => {
    this.setState(previousState => ({
      ...previousState,
      open: !previousState.open
    }));
  };

  handleBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      open: false
    }));
  };

  render() {
    const { message, onClick, ref, ...restOfProps } = this.props;

    return (
      <Container
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...restOfProps}
      >
        <Menu style={{ display: this.state.open ? 'flex' : 'none' }}>
          <MenuHeader
            style={{
              display: this.state.open ? 'block' : 'none'
            }}
          >
            {this.props.message}
          </MenuHeader>
          {this.props.actions.map((action, index) => (
            <MenuItem key={index}>{action}</MenuItem>
          ))}
        </Menu>
        <Message
          className="message"
          style={{
            display: this.state.hovering && !this.state.open ? 'block' : 'none'
          }}
        >
          {this.props.message}
        </Message>
        <Plus>
          <VerticalLine />
          <HorizontalLine />
        </Plus>
      </Container>
    );
  }
}
