import * as React from 'react';
import styled from 'styled-components';
import { View, Text, Fa, Nav } from './components';
import { Router, Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';
import * as styles from './styles';
import { Auth } from './auth';
import { Landing } from './routes/landing';
import { Callback } from './routes/callback';

import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

const StyledView = styled(View)`
  &,
  & * {
    color: ${styles.gray};
  }
  &:hover,
  &:hover * {
    color: ${styles.grayDark};
  }
  &:active,
  &:active * {
    color: ${styles.black};
  }
`;

function renderApp() {
  if (Auth.loggedIn()) {
    return <AuthenticatedRoute />;
  }
  return <Redirect to="/login" />;
}

function onSignOutClick() {
  return Auth.logout();
}

const AuthenticatedRouteContainer = styled(View)`
  flex: 1;
`;

const Header = styled(View)`
  padding: ${styles.space(0)};
  flex-direction: row;
  background-color: ${styles.white};
  /* border-bottom: ${styles.border}; */
  box-shadow: ${styles.boxShadow(-2)};
  z-index: 10;
`;

const HeaderContent = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  flex: 1;
`;

const User = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: ${styles.space(0)};
`;

const UserName = styled(Text)`
  margin-left: ${styles.space(0)};
`;
const Settings = styled(View)`
  margin-left: ${styles.space(0)};
`;
const SignOut = styled(View)`
  margin-left: ${styles.space(0)};
`;

const Body = styled(View)`
  flex-direction: row;
  flex: 1;
  overflow: auto;
`;

const Content = styled(View)`
  flex: 1;
  overflow: auto;
`;

const Brand = styled(Text)`
  color: ${styles.signatureBlue};
`;

export function AuthenticatedRoute() {
  return (
    <AuthenticatedRouteContainer>
      <Header>
        <View>
          <Brand large strong>
            MPlan
          </Brand>
        </View>

        <HeaderContent>
          <User>
            <Fa icon="user" size="2x" />
            <UserName>{Auth.userDisplayName() || ''}</UserName>
          </User>
          <Settings>
            <Fa icon="cog" size="2x" />
          </Settings>
          <SignOut onClick={onSignOutClick}>
            <Fa icon="signOut" size="2x" />
          </SignOut>
        </HeaderContent>
      </Header>

      <Body>
        <Nav />
        <Content>
          <Switch>
            {Routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component as any}
              />
            ))}
            <Redirect from="/" to={Routes[0].path} />
          </Switch>
        </Content>
      </Body>
    </AuthenticatedRouteContainer>
  );
}

function renderLanding() {
  if (Auth.loggedIn()) {
    return <Redirect to="/timeline" />;
  }
  return <Landing />;
}

const AppContent = styled(View)`
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: ${styles.background};
`;

export function App() {
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
