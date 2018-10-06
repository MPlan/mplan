import * as Model from 'models';
import { history } from 'client/history';
import { RequirementGroupList, CourseGroupViewModel } from './course-group-summary';

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
      ) as CourseGroupViewModel[],
      groupsColumnTwo: Model.MasteredDegree.getCourseGroupsColumnTwo(
        masteredDegree,
      ) as CourseGroupViewModel[],
      groupsColumnThree: Model.MasteredDegree.getCourseGroupsColumnThree(
        masteredDegree,
      ) as CourseGroupViewModel[],
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
