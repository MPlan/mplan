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

const StyledView = styled(View) `
  &, & * {
    color: ${styles.gray};
  }
  &:hover, &:hover * {
    color: ${styles.grayDark};
  }
  &:active, &:active * {
    color: ${styles.black};
  }
`;

function renderApp() {
  if (Auth.loggedIn()) { return <AuthenticatedRoute />; }
  return <Redirect to="/login" />
}

function onSignOutClick() {
  return Auth.logout();
}

const AuthenticatedRouteContainer = styled(View) ` flex-direction: row; `;

const Header = styled(View) `
  padding: ${styles.spacing(0)};
  border: solid ${styles.borderWidth} ${styles.border};
  flex-direction: row;
  flex: 0 0;
`;

const HeaderContent = styled(View) `
  flex-direction: row;
  justify-content: flex-end;
  flex: 1;
`;

const User = styled(View) `
  flex-direction: row;
  /* align-items: center; */
  margin-left: ${styles.spacing(0)};
`;

const UserName = styled(Text) ` margin-left: ${styles.spacing(0)}; `;
const Settings = styled(View) ` margin-left: ${styles.spacing(0)}; `;
const SignOut = styled(View) ` margin-left: ${styles.spacing(0)}; `;

const Body = styled(View) `
  flex-direction: row;
  flex: 1;
  overflow: auto;
`;

const Content = styled(View) `
  flex: 1;
  overflow: auto;
`;

export function AuthenticatedRoute() {
  return <AuthenticatedRouteContainer>
    <Header>
      <View>
        <Text large strong>MPlan</Text>
      </View>

      <HeaderContent>
        <User>
          <Fa icon="user" size="2x" />
          <UserName>{Auth.userDisplayName() || ''}</UserName>
        </User>
        <Settings><Fa icon="cog" size="2x" /></Settings>
        <SignOut onClick={onSignOutClick}><Fa icon="signOut" size="2x" /></SignOut>
      </HeaderContent>
    </Header>

    <Body>
      <Nav />
      <Content>
        <Switch>
          {Routes.map(route => <Route
            key={route.path}
            path={route.path}
            component={route.component as any}
          />)}
          <Redirect from="/" to={Routes[0].path} />
        </Switch>
      </Content>
    </Body>
  </AuthenticatedRouteContainer>;
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
