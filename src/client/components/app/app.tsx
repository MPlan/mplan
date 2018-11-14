import * as React from 'react';
import styled from 'styled-components';

import { history } from 'client/history';
import { Auth } from 'client/auth';

import { Router, Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { Callback } from 'routes/callback';
import { View } from 'components/view';
import { Routes } from 'client/routes';
import { AuthenticatedRoutes } from './components/authenticated-routes';

function renderLanding() {
  if (Auth.loggedIn()) return <Redirect to={Routes[0].path} />;
  Auth.login();
  return <Callback noHandleCallback />;
}

function renderApp() {
  if (Auth.loggedIn()) return <AuthenticatedRoutes />;
  Auth.login();
  return <Callback noHandleCallback />;
}

interface AppContentProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  disableSelecting?: boolean;
}

const AppContent = styled<AppContentProps>(View)`
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

interface AppProps {
  onMount: () => any;
}

export class App extends React.Component<AppProps, {}> {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    return (
      <AppContent>
        <Router history={history}>
          <Switch>
            <Route path="/callback" component={Callback} />
            <Route path="/login" render={renderLanding} />
            <Route render={renderApp} />
          </Switch>
        </Router>
      </AppContent>
    );
  }
}
