import { ObjectId } from 'utilities/object-id';
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
      history.push('/degree-manager');
      return {
        masteredDegreeId: '',
        groupsColumnOne: [],
        groupsColumnTwo: [],
        groupsColumnThree: [],
      };
    }

    return {
      masteredDegreeId: ownProps.masteredDegreeId,
      groupsColumnOne: Model.MasteredDegree.getGroupsColumnOne(masteredDegree) as GroupViewModel[],
      groupsColumnTwo: Model.MasteredDegree.getGroupsColumnTwo(masteredDegree) as GroupViewModel[],
      groupsColumnThree: Model.MasteredDegree.getGroupsColumnThree(
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
        const newGroupId = ObjectId();
        const createGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.createNewGroup(masteredDegree, groupName, column, newGroupId);

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          createGroup,
        );

        history.push(`/degree-manager/${ownProps.masteredDegreeId}/groups/${newGroupId}`);

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
