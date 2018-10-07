import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Empty } from 'components/empty';
import { Course } from './course';

const { getCatalogId } = Model.Course;

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: scroll;
  max-height: 25rem;
  border-top: 1px solid ${styles.grayLighter};
  border-bottom: 1px solid ${styles.grayLighter};
`;

interface CourseListProps {
  courses: Model.Course.Model[];
  presetCourses: { [catalogId: string]: true | undefined };
}

export class CourseList extends React.PureComponent<CourseListProps, {}> {
  render() {
    const { courses, presetCourses } = this.props;
    return (
      <Root>
        {courses.length > 0 ? (
          courses.map(course => (
            <Course
              preset={!!presetCourses[getCatalogId(course)]}
              key={getCatalogId(course)}
              course={course}
            />
          ))
        ) : (
          <Empty title="Nothing here yet!" subtitle="Add a course by clicking the button above." />
        )}
      </Root>
    );
  }
}
