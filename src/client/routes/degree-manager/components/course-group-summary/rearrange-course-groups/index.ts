import * as Model from 'models';

import { RearrangeGroups, GroupViewModel } from './rearrange-groups';

interface RearrangeCourseGroupsContainsProps {
  masteredDegreeId: string;
  open: boolean;
  onClose: () => void;
}

const Container = Model.store.connect({
  mapDispatchToProps: (dispatch, ownProps: RearrangeCourseGroupsContainsProps) => ({
    onRearrange: (fromColumn: number, toColumn: number, oldIndex: number, newIndex: number) => {
      dispatch(state => {
        const rearrangeCourseGroups = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.rearrangeCourseGroups(
            masteredDegree,
            fromColumn,
            toColumn,
            oldIndex,
            newIndex,
          );

        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            rearrangeCourseGroups,
          ),
        };
      });
    },
  }),
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
    ) as GroupViewModel[];
    const courseGroupsColumnTwo = Model.MasteredDegree.getCourseGroupsColumnTwo(
      masteredDegree,
    ) as GroupViewModel[];
    const courseGroupsColumnThree = Model.MasteredDegree.getCourseGroupsColumnThree(
      masteredDegree,
    ) as GroupViewModel[];

    return {
      ...restOfOwnProps,
      courseGroupsColumnOne,
      courseGroupsColumnTwo,
      courseGroupsColumnThree,
    };
  },
})(RearrangeGroups);

export { Container as RearrangeCourseGroups };
