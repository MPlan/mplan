import * as Model from 'models';
import { CourseList } from './course-list';

interface CourseListContainerProps {
  showDefaults: boolean;
  catalogIds: string[];
  presetCourses: { [catalogId: string]: true | undefined };
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: CourseListContainerProps) => ({
    courses: ownProps.catalogIds.map(catalogId => state.catalog[catalogId]).filter(x => !!x),
    presetCourses: ownProps.presetCourses,
    showDefaults: ownProps.showDefaults,
  }),
  mapDispatchToProps: state => ({}),
})(CourseList);

export { Container as CourseList };
