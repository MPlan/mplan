import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';

import { SortableContainer } from 'react-sortable-hoc';
import { View } from 'components/view';
import { Empty } from 'components/empty';
import { SortableCourse } from './sortable-course';

const { getCatalogId } = Model.Course;

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;

interface CourseListProps {
  courses: Model.Course.Model[];
  onRemove: (courseKey: string) => void;
}

class CourseList extends React.PureComponent<CourseListProps, {}> {
  handleToggle(course: Model.Course.Model) {
    this.props.onRemove(getCatalogId(course));
  }

  render() {
    const { courses } = this.props;
    return (
      <Root>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <SortableCourse
              index={index}
              key={`${course.subjectCode} ${course.courseNumber}`}
              course={course}
              onRemove={() => this.handleToggle(course)}
            />
          ))
        ) : (
          <Empty title="Nothing here yet." subtitle="When you add courses, they'll appear here." />
        )}
      </Root>
    );
  }
}

export const SortableCourseList = SortableContainer<CourseListProps>(props => (
  <CourseList {...props} />
));
