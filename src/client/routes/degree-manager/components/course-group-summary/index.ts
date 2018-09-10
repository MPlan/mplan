import * as Model from 'models';
import { history } from 'client/history';
import { CourseGroupSummary } from './course-group-summary';

interface CourseGroupSummaryContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: () => ({}),
  mapDispatchToProps: (dispatch, ownProps: CourseGroupSummaryContainerProps) => ({
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
  }),
})(CourseGroupSummary);

export { Container as CourseGroupSummary };
