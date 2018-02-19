import * as React from 'react';
import { View, Text, Fa } from './';
import * as styles from '../styles';
import { Routes } from '../routes';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(NavLink) `
  color: ${styles.grayLight};
  & { text-decoration: none; }
  &:hover, &:hover * { color: ${styles.beeKeeper}; }
  
  &.active:hover,
  &.active:hover *,
  &.active,
  &:active,
  &:active * {
    color: ${styles.turbo};
  }
`;

const NavButtonContainer = styled(View) `
  padding: ${styles.space(0)};
  align-items: center;
`;

interface NavButtonProps {
  name: string,
  to: string,
  icon: string,
}
interface NavButtonState { }

class NavButton extends React.Component<NavButtonProps, NavButtonState> {
  constructor(props: NavButtonProps) {
    super(props);
    this.state = {
      hovering: false,
    }
  }

  render() {
    return <StyledLink to={this.props.to} activeClassName="active">
      <NavButtonContainer>
        <Fa icon={this.props.icon} size="2x" />
      </NavButtonContainer>
    </StyledLink>
  }
}

const NavContainer = styled(View) `
  width: 4rem;
  background-color: ${styles.deepCove};
  color: ${styles.white};
`;

export function Nav() {
  return <NavContainer>
    {Routes.map(route => <NavButton
      key={route.path}
      to={route.path}
      name={route.name}
      icon={route.icon}
    />)}
  </NavContainer>
}