import * as React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { Course, CourseProps } from './course';

export const SortableCourse = SortableElement<CourseProps>(props => <Course sortable {...props} />);
