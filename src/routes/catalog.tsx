import * as React from 'react';
import { View, Text } from '../components/base';

interface CatalogState { }
export class Catalog extends React.Component<{}, CatalogState> {
  render() {
    return <View><Text>from Catalog</Text></View>
  }
}