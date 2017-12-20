import * as React from 'react';
import styled from 'styled-components';
import { View, Text } from './components/base';

export function App() {
  return <View style={{ backgroundColor: 'red', height: '100vh' }}>
    <View>
      <Text strong large>Header</Text>
      <Text>The quick brown fox jumps over the lazy dog.</Text>
    </View>
  </View>;
}