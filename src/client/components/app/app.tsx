import * as React from 'react';
import styled from 'styled-components';

import { history } from 'client/history';
import { Auth } from 'client/auth';

import { Router, Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { Landing } from 'routes/landing';
import { Callback } from 'routes/callback';
import { View } from 'components/view';
import { AuthenticatedRoutes } from './components/authenticated-routes';

function renderLanding() {
  if (Auth.loggedIn()) return <Redirect to="/timeline" />;
  return <Landing />;
}

function renderApp(props: RouteComponentProps<any>) {
  if (Auth.loggedIn()) return <AuthenticatedRoutes />;
  return <Redirect to="/login" />;
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
