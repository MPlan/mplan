import * as React from 'react';
import { View, Text } from '../components';
import { Auth } from '../auth';
import { history } from '../app';
import styled from 'styled-components';

const CallbackContainer = styled(View) `
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export function Callback() {

  Auth.handleCallback().then(() => {
    history.push('/timeline');
  });

  return <CallbackContainer>
    <View>
      <Text strong extraLarge>Logging you in...</Text>
    </View>
  </CallbackContainer>;
}