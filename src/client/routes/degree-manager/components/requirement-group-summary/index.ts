import * as Model from 'models';
import { history } from 'client/history';
import { NonFunctionProps, FunctionProps } from 'utilities/typings';

import { RequirementGroupSummary, RequirementGroupSummaryProps } from './requirement-group-summary';

interface RequirementGroupSummaryContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (
    state,
    ownProps: RequirementGroupSummaryContainerProps,
  ): NonFunctionProps<RequirementGroupSummaryProps> | undefined => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );
    if (!masteredDegree) return undefined;

    if (!ownProps.groupId) return undefined;
    const group = Model.MasteredDegree.getGroup(masteredDegree, ownProps.groupId);
    if (!group) return undefined;

    const courses = group.courses.map(catalogId => state.catalog[catalogId]).filter(x => !!x);

    const prepopulatedCourses =
      group.courseMode === 'alternates-allowed'
        ? courses.filter(course => !!group.presetCourses[Model.Course.getCatalogId(course)])
        : courses;

    const minimumPrepopulatedCredits = prepopulatedCourses
      .map(course => {
        const { creditHours } = course;
        if (creditHours === undefined) return 0;
        if (Array.isArray(creditHours)) return creditHours[0];
        return creditHours;
      })
      .reduce((sum, next) => sum + next, 0);

    const maximumPrepopulatedCredits = prepopulatedCourses
      .map(course => {
        const { creditHours } = course;
        if (creditHours === undefined) return 0;
        if (Array.isArray(creditHours)) return creditHours[1];
        return creditHours;
      })
      .reduce((sum, next) => sum + next, 0);

    return {
      group,
      minimumPrepopulatedCredits,
      maximumPrepopulatedCredits,
    };
  },
  mapDispatchToProps: (
    _,
    ownProps: RequirementGroupSummaryContainerProps,
  ): FunctionProps<RequirementGroupSummaryProps> => ({
    onBackClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}`);
    },
  }),
})(RequirementGroupSummary);

export { Container as RequirementGroupSummary };
