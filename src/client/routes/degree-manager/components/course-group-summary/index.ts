import * as Model from 'models';
import { history } from 'client/history';
import { CourseGroupSummary, CourseGroupViewModel } from './course-group-summary';
import { memoizeAll } from 'utilities/memoize-all';

interface CourseGroupSummaryContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: CourseGroupSummaryContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    if (!masteredDegree) {
      throw new Error(`could not find mastered degree with id ${ownProps.masteredDegreeId}`);
    }

    return {
      courseGroupsColumnOne: Model.MasteredDegree.getCourseGroupsColumnOne(
        masteredDegree,
      ) as CourseGroupViewModel[],
      courseGroupsColumnTwo: Model.MasteredDegree.getCourseGroupsColumnTwo(
        masteredDegree,
      ) as CourseGroupViewModel[],
      courseGroupsColumnThree: Model.MasteredDegree.getCourseGroupsColumnThree(
        masteredDegree,
      ) as CourseGroupViewModel[],
    };
  },
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
    onRearrange: () => {},
    onDelete: (groupId: string) => {},
    onChangeColumn: (groupId: string) => {},
  }),
})(CourseGroupSummary);

export { Container as CourseGroupSummary };
