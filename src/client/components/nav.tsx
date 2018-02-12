import * as React from 'react';
import { View, Text, p } from './base';
import * as Styles from './styles';
import { Routes } from '../routes';
import { Link } from 'react-router-dom';
import { Fa } from './fa';
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

interface NavButtonProps {
  name: string,
  to: string,
  icon: string,
}
interface NavButtonState {
}
class NavButton extends React.Component<NavButtonProps, NavButtonState> {
  constructor(props: NavButtonProps) {
    super(props);
    this.state = {
      hovering: false,
    }
  }

  render() {
    return <StyledLink to={this.props.to}>
      <View
        padding
        alignItems="center"
      >
        <Fa icon={this.props.icon} size="2x" />
      </View>
    </StyledLink>
  }
}

export function Nav() {
  return <View
    backgroundColor={Styles.white}
    border
    width={4}
    style={{ borderTop: 0 }}
  >
    {Routes.map(route => <NavButton
      key={route.path}
      to={route.path}
      name={route.name}
      icon={route.icon}
    />)}
  </View>
}