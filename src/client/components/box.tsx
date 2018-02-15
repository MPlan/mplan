import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';
import { Button } from '../components/button';
import { Course } from '../components/course';

export class Box extends Model.store.connect() {

  documentMouseUp = (e: MouseEvent) => {
    this.setStore(store => {
      const newStore = store.set('dragging', false);
      if (!store.dragging) { return newStore; }
      if (!store.mouseIsOverSemester) { return newStore; }
      const lastMouseOverSemesterId = store.lastMouseOverSemesterId;
      const hasMousedOverSemester = store.semesterMap.has(store.lastMouseOverSemesterId);
      if (!hasMousedOverSemester) { return newStore; }
      const selectedCourse = store.selectedCourse;
      if (!selectedCourse) { return newStore; }

      return newStore.update('semesterMap', semesterMap =>
        semesterMap.update(lastMouseOverSemesterId, semester =>
          semester.update('courseMap', courseMap =>
            courseMap.set(selectedCourse.id, selectedCourse))));
    });
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.documentMouseUp);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mouseup', this.documentMouseUp);
  }

  onDeleteClick(course: Model.Course) {
    this.setStore(store => store.removeCourseFromBox(course));
  }

  onCourseMouseDown(course: Model.Course) {
    this.setStore(store => store
      .set('selectedCourseId', course.id)
      .set('dragging', true)
    );
  }

  render() {
    return <View
      flex={{ flexGrow: 0, flexShrink: 0 }}
      overflow
      padding
    >
      <View margin={{ bottom: true }}>
        <Text large strong>The box</Text>
        <Text>A quick place to put some course in.</Text>
      </View>
      <View flex={{ flexShrink: 0 }} overflow>
        {this.store.box.map(course => <Course
          key={course.id}
          course={course}
          onDeleteClick={() => this.onDeleteClick(course)}
          onMouseDown={() => this.onCourseMouseDown(course)}
        />)}
      </View>
    </View>;
  }
}
