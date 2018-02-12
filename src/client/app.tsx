import * as React from 'react';
import styled from 'styled-components';
import { View, Text } from './components/base';
import { Fa } from './components/fa';
import { Nav } from './components/nav';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';
import * as Styles from './components/styles';

const StyledView = styled(View)`
  &, & * {
    color: ${Styles.gray};
  }
  &:hover, &:hover * {
    color: ${Styles.black};
  }
`;

export function App() {
  return <BrowserRouter>
    <View
      backgroundColor={Styles.white}
      style={{
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
      }}
    >
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
          <StyledView margin={{ left: true }}><Fa icon="user" size="2x" /></StyledView>
          <StyledView margin={{ left: true }}><Fa icon="cog" size="2x" /></StyledView>
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
    </View>
  </BrowserRouter>;
}