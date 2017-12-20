import * as React from 'react';
import { View, Text } from '../components/base';

interface TimelineState { }

export class Timeline extends React.Component<{}, TimelineState> {
  render() {
    return <View>
      <Text>from timeline</Text>
    </View>
  }
}