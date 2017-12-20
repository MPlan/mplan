import * as React from 'react';
import { View, Text, p } from './base';
import * as Color from './colors';
import { Routes } from '../routes';
import { Link } from 'react-router-dom';
import { Fa } from './fa';
import styled from 'styled-components';

const StyledLink = styled(Link) `
  color: white
`

interface NavButtonProps {
  name: string,
  to: string,
  icon: string,
}
interface NavButtonState {
  hovering: boolean
}
class NavButton extends React.Component<NavButtonProps, NavButtonState> {
  constructor(props: NavButtonProps) {
    super(props);
    this.state = {
      hovering: false,
    }
  }

  onMouseEnter = () => {
    this.setState(previousState => ({ ...previousState, hovering: true }))
  }

  onMouseLeave = () => {
    this.setState(previousState => ({ ...previousState, hovering: false, }))
  }

  render() {
    return <StyledLink to={this.props.to}>
      <View
        padding
        alignItems="center"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Fa icon={this.props.icon} size="2x" />
        <Text
          small
          color={/*if*/ this.state.hovering ? Color.signatureMaize : Color.white}
          margin={{ top: p(-1) }}
        >{this.props.name}</Text>
      </View>
    </StyledLink>
  }
}

export function Nav() {
  return <View
    backgroundColor={Color.signatureBlue}
    width={5}
  >
    {Routes.map(route => <NavButton
      key={route.path}
      to={route.path}
      name={route.name}
      icon={route.icon}
    />)}
  </View>
}