import { CourseGroupDetail } from './course-group-detail';
import { withProps } from 'utilities/with-props';
import { history } from 'client/history';

interface CourseGroupDetailContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = withProps((ownProps: CourseGroupDetailContainerProps) => ({
  name: 'Test Group',
  onNameChange: (name: string) => {},
  onBackClick: () => {
    history.push(`/degree-manager/${ownProps.masteredDegreeId}`);
  },
}))(CourseGroupDetail);

export { Container as CourseGroupDetail };
