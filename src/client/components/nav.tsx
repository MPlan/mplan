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
  box-shadow: ${styles.boxShadow(0)};
`;

const NavText = styled(Text) `
  margin-top: ${styles.space(-1)};
  text-align: center;
`;

interface NavButtonProps {
  name: string,
  to: string,
  icon: string,
}

function NavButton(props: NavButtonProps) {
  return <StyledLink to={props.to} activeClassName="active">
    <NavButtonContainer>
      <Fa icon={props.icon} size="2x" />
      <NavText small>{props.name}</NavText>
    </NavButtonContainer>
  </StyledLink>;
}

const NavContainer = styled(View) `
  width: 5rem;
  min-width: 5rem;
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