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
    onCreateGroup: (groupName: string, column: 1 | 2 | 3) => {},
  }),
})(CourseGroupSummary);

export { Container as CourseGroupSummary };
