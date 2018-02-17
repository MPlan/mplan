import * as React from 'react';
import { View, Text, Fa } from './';
import * as styles from '../styles';
import { Routes } from '../routes';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link) `
  color: ${styles.gray};

  & {
    text-decoration: none;
  }

  &:hover, &:hover * {
    color: ${styles.black};
  }
`;

const NavButtonContainer = styled(View) `
  padding: ${styles.spacing(0)};
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
  border: solid ${styles.borderWidth} ${styles.border};
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