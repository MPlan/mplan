import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';

import { SortableContainer, SortEnd } from 'react-sortable-hoc';
import { View } from 'components/view';
import { SortableCourse } from './course';

const { getCatalogId } = Model.Course;

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;

interface CourseListProps {
  disableSorting?: boolean;
  courses: Model.Course.Model[];
  addedCourses: { [courseKey: string]: true | undefined };
  onAdd: (courseKey: string) => void;
  onRemove: (courseKey: string) => void;
  onRearrange?: (oldIndex: number, newIndex: number) => void;
}

class CourseList extends React.PureComponent<CourseListProps, {}> {
  hasCourse(course: Model.Course.Model) {
    const catalogId = getCatalogId(course);
    return !!this.props.addedCourses[catalogId];
  }

  handleToggle(course: Model.Course.Model) {
    const { onAdd, onRemove } = this.props;
    if (this.hasCourse(course)) {
      onRemove(getCatalogId(course));
    } else {
      onAdd(getCatalogId(course));
    }
  }

  render() {
    const { courses, disableSorting } = this.props;
    return (
      <Root>
        {courses.map((course, index) => (
          <SortableCourse
            index={index}
            disabled={disableSorting}
            added={this.hasCourse(course)}
            key={`${course.subjectCode} ${course.courseNumber}`}
            course={course}
            onToggle={() => this.handleToggle(course)}
          />
        ))}
      </Root>
    );
  }
}

export const SortableCourseList = SortableContainer<CourseListProps>(props => (
  <CourseList {...props} />
));
