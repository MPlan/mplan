import * as Model from 'models';
import { CourseList } from './course-list';

interface CourseListContainerProps {
  catalogIds: string[];
  presetCourses: { [catalogId: string]: true | undefined };
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: CourseListContainerProps) => ({
    courses: ownProps.catalogIds.map(catalogId => state.catalog[catalogId]).filter(x => !!x),
    presetCourses: ownProps.presetCourses,
  }),
  mapDispatchToProps: state => ({}),
})(CourseList);

export { Container as CourseList };
