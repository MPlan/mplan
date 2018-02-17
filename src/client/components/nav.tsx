import * as React from 'react';
import { View, Text, Fa } from './';
import * as Styles from '../styles';
import { Routes } from '../routes';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link) `
  color: ${Styles.gray};

  & {
    text-decoration: none;
  }

  &:hover, &:hover * {
    color: ${Styles.black};
  }
`;

const NavButtonContainer = styled(View) `
  padding: ${Styles.spacing(0)};
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
    return <StyledLink to={this.props.to}>
      <NavButtonContainer>
        <Fa icon={this.props.icon} size="2x" />
      </NavButtonContainer>
    </StyledLink>
  }
}

const NavContainer = styled(View) `
  border: solid ${Styles.borderWidth} ${Styles.border};
  border-top: 0;
  width: 4rem;
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