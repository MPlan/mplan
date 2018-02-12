import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';
import { Button } from '../components/button';
import { Course } from '../components/course';

export class Box extends Model.store.connect({
  get: store => ({ box: store.box }),
  set: (store, { }) => store,
}) {

  documentMouseUp = (e: MouseEvent) => {
    this.setGlobalStore(store => store.set('dragging', false));
  }

  componentDidMount() {
    super.componentDidMount();
    document.addEventListener('mouseup', this.documentMouseUp);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mouseup', this.documentMouseUp);
  }

  onDeleteClick(course: Model.Course) {
    this.setGlobalStore(store => store
      .update('boxMap', boxMap => boxMap
        .delete(course._id.toHexString())));
  }

  onCourseMouseDown(course: Model.Course) {
    this.setGlobalStore(store => store
      .set('selectedCourseId', course.id)
      .set('dragging', true)
    );
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
        <Text large strong>The box</Text>
        <Text>A quick place to put some course in.</Text>
      </View>
      <View flex>
        {this.state.box.map(course => <Course
          key={course.id}
          course={course}
          onDeleteClick={() => this.onDeleteClick(course)}
          onMouseDown={() => this.onCourseMouseDown(course)}
        />)}
      </View>
    </View>;
  }
}