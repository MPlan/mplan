import { history } from 'client/history';
import { withProps } from 'utilities/with-props';

import { CourseGroupSummary } from './course-group-summary';

const Container = withProps((ownProps: { masteredDegreeId: string }) => ({
  onGroupClick: (groupId: string) => {
    const { masteredDegreeId } = ownProps;
    history.push(`/degree-manager/${masteredDegreeId}/groups/${groupId}`);
  },
}))(CourseGroupSummary);

export { Container as CourseGroupSummary };
