import * as Model from 'models';

import { RearrangeCourseGroups, CourseGroupViewModel } from './rearrange-course-groups';

interface RearrangeCourseGroupsContainsProps {
  masteredDegreeId: string;
  open: boolean;
  onClose: () => void;
}

const Container = Model.store.connect({
  mapDispatchToProps: () => ({}),
  mapStateToProps: (
    state,
    { masteredDegreeId, ...restOfOwnProps }: RearrangeCourseGroupsContainsProps,
  ) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      masteredDegreeId,
    );

    if (!masteredDegree) {
      return {
        ...restOfOwnProps,
        courseGroupsColumnOne: [],
        courseGroupsColumnTwo: [],
        courseGroupsColumnThree: [],
      };
    }

    const courseGroupsColumnOne = Model.MasteredDegree.getCourseGroupsColumnOne(
      masteredDegree,
    ) as CourseGroupViewModel[];
    const courseGroupsColumnTwo = Model.MasteredDegree.getCourseGroupsColumnTwo(
      masteredDegree,
    ) as CourseGroupViewModel[];
    const courseGroupsColumnThree = Model.MasteredDegree.getCourseGroupsColumnThree(
      masteredDegree,
    ) as CourseGroupViewModel[];

    return {
      ...restOfOwnProps,
      courseGroupsColumnOne,
      courseGroupsColumnTwo,
      courseGroupsColumnThree,
    };
  },
})(RearrangeCourseGroups);

export { Container as RearrangeCourseGroups };
