import * as React from 'react';
import styled from 'styled-components';
import { View, Text } from './components/base';
import { Nav } from './components/nav';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { Routes } from './routes';


function SemesterBlock() {

}


export function App() {
  return <BrowserRouter>
    <View row style={{ height: '100vh' }}>
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