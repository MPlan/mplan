import * as React from 'react';
import styled from 'styled-components';
import { View } from 'components/view';
import { Nav } from '../nav';
import { AppBar } from '../app-bar';
import { Loading } from 'components/loading';
import { RouteDefinition } from 'client/routes';
import { Route, Switch } from 'react-router';

const Root = styled(View)`
  flex: 1 1 auto;
`;
const Body = styled(View)`
  flex-direction: row;
  flex: 1 1 auto;
`;
const Content = styled(View)`
  flex: 1 1 auto;
`;

interface AuthenticatedRoutesProps {
  loaded: boolean;
  onMount: () => any;
  isAdmin: boolean;
  routes: RouteDefinition[];
}

export class AuthenticatedRoutes extends React.Component<AuthenticatedRoutesProps, {}> {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    const { loaded, routes, isAdmin } = this.props;
    if (!loaded) return <Loading />;

    return (
      <Root>
        <AppBar />
        <Body>
          <Nav />
          <Content>
            <Switch>
              {routes
                .filter(route => {
                  if (isAdmin) return true;
                  return !route.requiresAdmin;
                })
                .map(route => (
                  <Route key={route.path} path={route.path} component={route.component} />
                ))}
            </Switch>
          </Content>
        </Body>
      </Root>
    );
  }
}
