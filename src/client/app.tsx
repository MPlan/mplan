import * as React from 'react';
import * as Model from './models';
import * as styles from './styles';
import styled from 'styled-components';
import { Router, Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { history } from './history';
import { Auth } from './auth';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { Nav } from 'components/nav';
import { Loading } from 'components/loading';

import { Routes, BottomRoutes } from './routes';
import { Landing } from './routes/landing';
import { Callback } from './routes/callback';

const AuthenticatedRouteContainer = styled(View)`
  flex: 1 1 auto;
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
  flex: 1 1 auto;
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
  flex: 1 1 auto;
  overflow: auto;
`;
const Content = styled(View)`
  flex: 1 1 auto;
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
const Saving = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-right: ${styles.space(0)};
`;
const SavingText = styled(Text)`
  margin-right: ${styles.space(0)};
`;

function handleShowHideToolbox() {
  Model.store.sendUpdate(store => store.updateUi(ui => ui.update('showToolbox', show => !show)));
}

export function _AuthenticatedRoute(
  props: RouteComponentProps<any> & { loaded: boolean; saving: number },
) {
  return !props.loaded ? (
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
          <Saving>
            <SavingText>{props.saving ? 'Saving...' : 'All changes saved'}</SavingText>
            {!!props.saving && <Fa icon="spinner" pulse size="2x" />}
            <Text small>{props.saving}</Text>
          </Saving>
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
            {BottomRoutes.map(route => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect from="/" to={Routes[0].path} />
          </Switch>
        </Content>
      </Body>
    </AuthenticatedRouteContainer>
  );
}

const AuthenticatedRoute = Model.store.connect({
  scopeTo: store => store.ui,
  mapDispatchToProps: () => ({}),
  mapStateToProps: (scope: Model.Ui, ownProps: RouteComponentProps<any>) => ({
    ...ownProps,
    saving: scope.saving,
    loaded: scope.loaded,
  }),
  _debugName: 'auth route',
})(_AuthenticatedRoute);

function renderLanding() {
  if (Auth.loggedIn()) {
    return <Redirect to="/timeline" />;
  }
  return <Landing />;
}

function renderApp(props: RouteComponentProps<any>) {
  if (Auth.loggedIn()) {
    return <AuthenticatedRoute {...props} />;
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
