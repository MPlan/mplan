import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Empty } from 'components/empty';
import { Course } from './course';

const { getCatalogId } = Model.Course;

const Root = styled(View)`
  & > * {
    flex: 0 0 auto;
  }
  overflow: auto;
`;

interface CourseListProps {
  courses: Model.Course.Model[];
  addedCourses: { [catalogId: string]: true | undefined };
  empty: React.ReactNode;
  onRemove: (catalogId: string) => void;
  onAdd: (catalogId: string) => void;
}

export class CourseList extends React.PureComponent<CourseListProps, {}> {
  handleToggle(catalogId: string) {
    const { addedCourses, onRemove, onAdd } = this.props;
    if (addedCourses[catalogId]) {
      onRemove(catalogId);
    } else {
      onAdd(catalogId);
    }
  }

  render() {
    const { courses, addedCourses, empty } = this.props;
    return (
      <Root>
        {courses.length > 0
          ? courses.map(course => (
              <Course
                key={getCatalogId(course)}
                course={course}
                added={!!addedCourses[getCatalogId(course)]}
                onToggle={() => this.handleToggle(getCatalogId(course))}
              />
            ))
          : empty}
      </Root>
    );
  }
}
