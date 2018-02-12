import * as React from 'react';
import { View, Text } from '../components/base';
import { Auth } from '../auth';
import { history } from '../app';

export function Callback() {

  Auth.handleCallback().then(() => {
    history.push('/timeline');
  });

  return <View flex justifyContent="center" alignItems="center">
    <View>
      <Text strong extraLarge>Logging you in...</Text>
    </View>
  </View>;
}