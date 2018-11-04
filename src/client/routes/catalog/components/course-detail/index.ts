import * as Model from 'models';

import { CourseDetail } from './course-detail';

interface CourseDetailContainerProps {
  subjectCode: string;
  courseNumber: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, { subjectCode, courseNumber }: CourseDetailContainerProps) => {

    const { user, prerequisiteOverrides, catalog } = state;
    if (!user) throw new Error('user required');

    const course = Model.Catalog.getCourse(catalog, subjectCode, courseNumber);
    if (!course) throw new Error('course does not exist');

    return {
      course,
      overrideApplied: !!Model.Course.getPrerequisiteOverrideType(
        course,
        user,
        prerequisiteOverrides,
      ),
      prerequisitesContainConcurrent: Model.Course.getPrerequisiteContainsConcurrent(
        course,
        user,
        prerequisiteOverrides,
      ),
      prerequisitesConsideringOverrides: Model.Course.getPrerequisitesConsideringOverrides(
        course,
        user,
        prerequisiteOverrides,
      ),
    };
  },
  mapDispatchToProps: dispatch => ({}),
})(CourseDetail);

export { Container as CourseDetail };
