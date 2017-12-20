import * as React from 'react';
import styled from 'styled-components';
import { View, Text } from './components/base';
import { Nav } from './components/nav';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';

export function App() {
  return <BrowserRouter>
    <View row style={{ height: '100vh', width: '100vw', maxHeight: '100vh', maxWidth: '100vw', }}>
      <Nav />
      <View flex>
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
  </BrowserRouter>;
}