import { CourseGroupDetail } from './course-group-detail';
// import * as Model from 'models';
import { withProps } from 'utilities/with-props';

interface CourseGroupDetailContainerProps {
  groupId: string;
}

const Container = withProps((ownProps: CourseGroupDetailContainerProps) => ({
  name: 'Test Group',
  onNameChange: (name: string) => {},
}))(CourseGroupDetail);

export { Container as CourseGroupDetail };
