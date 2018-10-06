import * as Model from 'models';
import { history } from 'client/history';
import { RequirementGroupList, GroupViewModel } from './requirement-group-list';

interface RequirementGroupListContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: RequirementGroupListContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    if (!masteredDegree) {
      throw new Error(`could not find mastered degree with id ${ownProps.masteredDegreeId}`);
    }

    return {
      masteredDegreeId: ownProps.masteredDegreeId,
      groupsColumnOne: Model.MasteredDegree.getCourseGroupsColumnOne(
        masteredDegree,
      ) as GroupViewModel[],
      groupsColumnTwo: Model.MasteredDegree.getCourseGroupsColumnTwo(
        masteredDegree,
      ) as GroupViewModel[],
      groupsColumnThree: Model.MasteredDegree.getCourseGroupsColumnThree(
        masteredDegree,
      ) as GroupViewModel[],
    };
  },
  mapDispatchToProps: (dispatch, ownProps: RequirementGroupListContainerProps) => ({
    onGroupClick: (groupId: string) => {
      const { masteredDegreeId } = ownProps;
      history.push(`/degree-manager/${masteredDegreeId}/groups/${groupId}`);
    },
    onCreateGroup: (groupName: string, column: number) => {
      dispatch(state => {
        const createCourseGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.createNewGroup(masteredDegree, groupName, column);

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          createCourseGroup,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onDelete: (groupId: string) => {
      dispatch(state => {
        const deleteGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.deleteGroup(masteredDegree, groupId);

        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            deleteGroup,
          ),
        };
      });
    },
  }),
})(RequirementGroupList);

export { Container as RequirementGroupList };
