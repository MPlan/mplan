import * as React from 'react';
import styled from 'styled-components';
import { View, Text, Button, Course } from './';
import * as styles from '../styles';
import * as Model from '../models';

const BoxContainer = styled(View) `
  overflow: auto;
  padding: ${styles.space(0)};
  flex: 1;
`;

const BoxHeader = styled(View) `
  margin-bottom: ${styles.space(0)};
`;

const BoxContent = styled(View) `
  overflow: auto;
`;

export class Box extends Model.store.connect() {

  documentMouseUp = (e: MouseEvent) => {
    this.setStore(store => {
      const newStore = store.update('ui', ui => ui.set('dragging', false));
      if (!store.ui.dragging) { return newStore; }
      if (!store.ui.mouseIsOverSemester) { return newStore; }
      const lastMouseOverSemester = store.ui.lastMouseOverSemester;
      if (!lastMouseOverSemester) { return newStore; }
      const hasMousedOverSemester = store.user.semesterSet.has(lastMouseOverSemester);
      if (!hasMousedOverSemester) { return newStore; }
      const selectedCourse = store.ui.selectedCourse;
      if (!selectedCourse) { return newStore; }

      return newStore;
      // return newStore.update('user', / user => user.update('semesterSet', semesterSet => semesterSet.update()));
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
    this.setStore(store =>
      store.update('user', user =>
        user.removeCourseFromBox(course)));
  }

  onCourseMouseDown(course: Model.Course) {
    // this.setStore(store => store
    //   .set('selectedCourseId', course.id)
    //   .set('dragging', true)
    // );
  }

  render() {
    return <BoxContainer>
      <BoxHeader>
        <Text large strong>The box</Text>
        <Text>A quick place to put some course in.</Text>
      </BoxHeader>
      <BoxContent>
        {this.store.user.box.map(course => <Course
          key={course.id}
          course={course}
          onDeleteClick={() => this.onDeleteClick(course)}
          onMouseDown={() => this.onCourseMouseDown(course)}
        />)}
      </BoxContent>
    </BoxContainer>;
  }
}
