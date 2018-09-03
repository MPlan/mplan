import * as React from 'react';
import styled from 'styled-components';
import { View } from 'components/view';
import { Nav } from '../nav';
import { AppBar } from '../app-bar';
import { Loading } from 'components/loading';

const Root = styled(View)`
  flex: 1 1 auto;
`;
const Body = styled(View)`
  flex-direction: row;
  flex: 1 1 auto;
`;
const Content = styled(View)`
  flex: 1 1 auto;
`;

interface AuthenticatedRoutesProps {
  loaded: boolean;
}

export class AuthenticatedRoutes extends React.Component<AuthenticatedRoutesProps, {}> {
  render() {
    const { loaded, children } = this.props;
    if (!loaded) <Loading />;

    return (
      <Root>
        <AppBar />
        <Body>
          <Nav />
          <Content>{children}</Content>
        </Body>
      </Root>
    );
  }
}
