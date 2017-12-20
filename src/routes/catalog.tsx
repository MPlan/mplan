import * as React from 'react';
import { View, Text } from '../components/base';

interface CatalogState { }
export class Catalog extends React.Component<{}, CatalogState> {
  render() {
    return <View flex justifyContent="center" alignItems="center">
      <View margin>
        <Text strong extraLarge>Coming soon...</Text>
      </View>
      <img src="catalog-design.png" />
    </View>
  }
}