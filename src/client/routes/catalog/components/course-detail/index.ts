import * as Model from 'models';

import { CourseDetail } from './course-detail';
import { history } from 'client/history';

interface CourseDetailContainerProps {
  open: boolean;
  subjectCode: string;
  courseNumber: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, { subjectCode, courseNumber, open }: CourseDetailContainerProps) => {
    const { user, prerequisiteOverrides, catalog } = state;
    if (!user) throw new Error('user required');

    const course = Model.Catalog.getCourse(catalog, subjectCode, courseNumber);
    if (!course) {
      // TODO: a 404 would be nicer
      history.replace('/catalog');

      return {
        open: false,
        course: {
          id: '',
          name: '',
          subjectCode: '',
          courseNumber: '',
          lastUpdateDate: 0,
        },
        overrideApplied: false,
        prerequisitesContainConcurrent: false,
        prerequisitesConsideringOverrides: undefined as any,
      };
    }

    return {
      open,
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
