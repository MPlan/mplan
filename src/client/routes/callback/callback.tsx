import * as React from 'react';
import styled from 'styled-components';
import { Auth } from 'client/auth';
import { history } from 'client/history';

import { View } from 'components/view';
import { Text } from 'components/text';

const CallbackContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export function Callback() {
  Auth.handleCallback().then(() => {
    history.push('/timeline');
  });

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
