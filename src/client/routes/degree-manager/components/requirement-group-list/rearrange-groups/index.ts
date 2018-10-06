import * as Model from 'models';

import { RearrangeGroups, GroupViewModel } from './rearrange-groups';

interface RearrangeGroupsContainsProps {
  masteredDegreeId: string;
  open: boolean;
  onClose: () => void;
}

const Container = Model.store.connect({
  mapDispatchToProps: (dispatch, ownProps: RearrangeGroupsContainsProps) => ({
    onRearrange: (fromColumn: number, toColumn: number, oldIndex: number, newIndex: number) => {
      dispatch(state => {
        const rearrangeGroups = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.rearrangeGroups(
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
            rearrangeGroups,
          ),
        };
      });
    },
  }),
  mapStateToProps: (
    state,
    { masteredDegreeId, ...restOfOwnProps }: RearrangeGroupsContainsProps,
  ) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      masteredDegreeId,
    );

    if (!masteredDegree) {
      return {
        ...restOfOwnProps,
        groupsColumnOne: [],
        groupsColumnTwo: [],
        groupsColumnThree: [],
      };
    }

    const groupsColumnOne = Model.MasteredDegree.getGroupsColumnOne(
      masteredDegree,
    ) as GroupViewModel[];
    const groupsColumnTwo = Model.MasteredDegree.getGroupsColumnTwo(
      masteredDegree,
    ) as GroupViewModel[];
    const groupsColumnThree = Model.MasteredDegree.getGroupsColumnThree(
      masteredDegree,
    ) as GroupViewModel[];

    return {
      ...restOfOwnProps,
      groupsColumnOne,
      groupsColumnTwo,
      groupsColumnThree,
    };
  },
})(RearrangeGroups);

export { Container as RearrangeGroups };
