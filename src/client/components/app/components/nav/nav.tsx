import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { NavLink } from 'react-router-dom';
import { RouteDefinition } from 'client/routes';

interface NavProps {
  isAdmin: boolean;
  routes: RouteDefinition[];
  bottomRoutes: RouteDefinition[];
}

const StyledLink = styled(NavLink)`
  color: ${styles.grayLight};
  & {
    text-decoration: none;
  }
  &:hover,
  &:hover * {
    color: ${styles.beeKeeper};
  }

  &.active:hover,
  &.active:hover *,
  &.active,
  &.active *,
  &:active,
  &:active * {
    color: ${styles.turbo} !important;
  }
`;
const NavButtonContainer = styled(View)`
  padding: ${styles.space(0)};
  align-items: center;
  box-shadow: ${styles.boxShadow(0)};
`;
const NavText = styled(Text)`
  color: ${styles.grayLight};
  margin-top: ${styles.space(-1)};
  text-align: center;
`;
const Spacer = styled.div`
  flex: 1 1 auto;
`;

interface NavButtonProps {
  name: string;
  to: string;
  icon: string;
}

function NavButton(props: NavButtonProps) {
  return (
    <StyledLink to={props.to} activeClassName="active">
      <NavButtonContainer>
        <Fa icon={props.icon} size="2x" />
        <NavText small>{props.name}</NavText>
      </NavButtonContainer>
    </StyledLink>
  );
}

const Root = styled(View)`
  flex: 0 0 auto;
  width: 5rem;
  min-width: 5rem;
  background-color: ${styles.deepCove};
  color: ${styles.white};
  overflow: auto;
`;

export class Nav extends React.PureComponent<NavProps, {}> {
  render() {
    const { isAdmin, routes, bottomRoutes } = this.props;
    return (
      <Root>
        {routes
          .filter(route => {
            if (isAdmin) return true;
            return !route.requiresAdmin;
          })
          .map(route => (
            <NavButton key={route.path} to={route.path} name={route.name} icon={route.icon} />
          ))}
        <Spacer />
        {bottomRoutes
          .filter(route => {
            if (isAdmin) return true;
            return !route.requiresAdmin;
          })
          .map(route => (
            <NavButton key={route.path} to={route.path} name={route.name} icon={route.icon} />
          ))}
      </Root>
    );
  }
}
