import * as React from 'react';
import * as Model from '../models';
import { View, Text } from '../components';

export class Degree extends Model.store.connect() {
  render() {
    return (
      <View>
        <Text>degree page works! (not to be confused with degreeworks)</Text>
      </View>
    );
  }
}
