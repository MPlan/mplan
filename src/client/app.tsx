import * as React from 'react';
import styled from 'styled-components';
import { View, Text } from './components/base';
import { Fa } from './components/fa';
import { Nav } from './components/nav';
import { Router, Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';
import * as Styles from './components/styles';
import { Auth } from './auth';
import { Landing } from './routes/landing';
import { Callback } from './routes/callback';

import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

const StyledView = styled(View) `
  &, & * {
    color: ${Styles.gray};
  }
  &:hover, &:hover * {
    color: ${Styles.grayDark};
  }
  &:active, &:active * {
    color: ${Styles.black};
  }
`;

function renderApp() {
  if (Auth.loggedIn()) { return <AuthenticatedRoute />; }
  return <Redirect to="/login" />
}

function onSignOutClick() {
  return Auth.logout();
}

export function AuthenticatedRoute() {
  return <View flex>
    <View
      _="header"
      backgroundColor={Styles.white}
      padding
      border
      row
    >
      <View>
        <Text large strong>MPlan</Text>
      </View>
      <View row justifyContent="flex-end" flex>
        <StyledView row alignItems="center" margin={{ left: true }}>
          <Fa icon="user" size="2x" />
          <Text margin={{ left: true }}>{Auth.userDisplayName() || ''}</Text>
        </StyledView>
        <StyledView margin={{ left: true }}><Fa icon="cog" size="2x" /></StyledView>
        <StyledView
          onClick={onSignOutClick}
          margin={{ left: true }}
        ><Fa icon="signOut" size="2x" /></StyledView>
      </View>
    </View>
    <View row flex overflow>
      <Nav />
      <View flex overflow>
        <Switch>
          {Routes.map(route => <Route
            key={route.path}
            path={route.path}
            component={route.component}
          />)}
          <Redirect from="/" to={Routes[0].path} />
        </Switch>
      </View>
    </View>
  </View>;
}

function renderLanding() {
  if (Auth.loggedIn()) {
    return <Redirect to="/timeline" />;
  }
  return <Landing />;
}

export function App() {
  return <Router history={history}>
    <View style={{
      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      maxWidth: '100vw',
    }}>
      <Switch>
        <Route path="/callback" component={Callback} />
        <Route path="/login" render={renderLanding} />
        <Route render={renderApp} />
      </Switch>
    </View>
  </Router>;
}
