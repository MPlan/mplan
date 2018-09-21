import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';

import { View } from 'components/view';
import { Empty } from 'components/empty';
import { Course } from './course';

const { getCatalogId } = Model.Course;

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: scroll;
  max-height: 25rem;
`;

interface CourseListProps {
  courses: Model.Course.Model[];
}

export class CourseList extends React.PureComponent<CourseListProps, {}> {
  render() {
    const { courses } = this.props;
    return (
      <Root>
        {courses.length > 0 ? (
          courses.map(course => <Course key={getCatalogId(course)} course={course} />)
        ) : (
          <Empty title="Nothing here yet!" subtitle="Add a course by clicking the button above." />
        )}
      </Root>
    );
  }
}
