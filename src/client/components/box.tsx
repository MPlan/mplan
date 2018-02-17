import * as React from 'react';
import styled from 'styled-components';
import { View, Text, Button, Course } from './';
import * as styles from '../styles';
import * as Model from '../models';

const BoxContainer = styled(View) `
  overflow: auto;
  padding: ${styles.spacing(0)};
  flex: 1;
`;

const BoxHeader = styled(View) `
  margin-bottom: ${styles.spacing(0)};
`;

const BoxContent = styled(View) `
  overflow: auto;
`;

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
    return <BoxContainer>
      <BoxHeader>
        <Text large strong>The box</Text>
        <Text>A quick place to put some course in.</Text>
      </BoxHeader>
      <BoxContent>
        {this.store.box.map(course => <Course
          key={course.id}
          course={course}
          onDeleteClick={() => this.onDeleteClick(course)}
          onMouseDown={() => this.onCourseMouseDown(course)}
        />)}
      </BoxContent>
    </BoxContainer>;
  }
}
