import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';
import { Button } from '../components/button';

export class Bin extends Model.store.connect({
  get: store => ({ bin: store.bin }),
  set: (store, { }) => store,
}) {

  onDeleteClick(course: Model.Course) {
    this.setGlobalStore(store => store
      .update('binMap', binMap => binMap
        .delete(course._id.toHexString())));
  }

  render() {
    return <View
      flex
      overflow
      width={20}
      border
      padding
      style={{ borderTop: 'none' }}
    >
      <View margin={{ bottom: true }}>
        <Text large strong>The bin</Text>
        <Text>A quick place to put some course in.</Text>
      </View>
      <View flex>
        {this.state.bin.map(course => <View
          key={course._id.toHexString()}
          row
          alignItems="baseline"
          border
          padding
          margin={{ bottom: true }}
        >
          <Text strong>{course.subjectCode}&nbsp;</Text>
          <Text strong>{course.courseNumber}&nbsp;</Text>
          <Text>{course.name}&nbsp;</Text>
          <Button onClick={() => this.onDeleteClick(course)}>x</Button>
        </View>)}
      </View>
    </View>;
  }
}
