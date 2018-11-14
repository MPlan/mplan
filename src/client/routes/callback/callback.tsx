import * as React from 'react';
import styled from 'styled-components';
import { Auth } from 'client/auth';
import { history } from 'client/history';
import { Routes } from 'client/routes';

import { View } from 'components/view';
import { Text } from 'components/text';

const CallbackContainer = styled(View)`
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
`;

export function Callback({ noHandleCallback }: { noHandleCallback?: boolean }) {
  if (!noHandleCallback) {
    Auth.handleCallback().then(() => {
      history.replace(Routes[0].path);
    });
  }

  return (
    <CallbackContainer>
      <View>
        <Text strong extraLarge>
          Logging you in...
        </Text>
      </View>
    </CallbackContainer>
  );
}
