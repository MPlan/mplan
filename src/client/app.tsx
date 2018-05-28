import * as React from 'react';
import styled from 'styled-components';
import { View, Text, Fa, Nav, Loading } from './components';
import { Router, Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';
import * as styles from './styles';
import { Auth } from './auth';
import { Landing } from './routes/landing';
import { Callback } from './routes/callback';
import * as Model from './models';

import createBrowserHistory from 'history/createBrowserHistory';
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
const ShowHideToolbox = styled.button`
  flex-direction: row;
  align-items: center;
  margin-left: ${styles.space(0)};
  border: none;
  background-color: transparent;
  outline: none;
  &:hover {
    color: ${styles.blue};
  }
  &:active {
    color: ${styles.linkHover};
  }
`;

function handleShowHideToolbox() {
  Model.store.sendUpdate(store => store.updateUi(ui => ui.update('showToolbox', show => !show)));
}

export class AuthenticatedRoute extends Model.store.connect({
  scope: store => store.ui,
  descope: (store, ui: Model.Ui) => store.set('ui', ui),
}) {
  render() {
    return !this.store.loaded ? (
      <Loading />
    ) : (
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
            <ShowHideToolbox onClick={handleShowHideToolbox}>
              <Fa icon="columns" size="2x" />
            </ShowHideToolbox>
          </HeaderContent>
        </Header>

        <Body>
          <Nav />
          <Content>
            <Switch>
              {Routes.map(route => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect from="/" to={Routes[0].path} />
            </Switch>
          </Content>
        </Body>
      </AuthenticatedRouteContainer>
    );
  }
}

function renderLanding() {
  if (Auth.loggedIn()) {
    return <Redirect to="/timeline" />;
  }
  return <Landing />;
}

function renderApp() {
  if (Auth.loggedIn()) {
    return <AuthenticatedRoute />;
  }
  return <Redirect to="/login" />;
}

export interface AppContentProps
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

export class App extends Model.store.connect({
  scope: store => store.ui.draggables,
  descope: (store, draggables: Model.Draggables) =>
    store.updateUi(ui => ui.set('draggables', draggables)),
}) {
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
