import * as React from 'react';

import { Text } from 'components/text';
import { Switch } from 'components/switch';
import { DegreeItem } from './degree-item';

export class PublishUnpublish extends React.PureComponent<{}, {}> {
  render() {
    return (
      <DegreeItem title="Publish or unpublish degree">
        <Text>test</Text>
        <Switch />
      </DegreeItem>
    );
  }
}
