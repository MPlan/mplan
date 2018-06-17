import * as React from 'react';
import * as Model from 'models';
import { CourseSearch } from './course-search';

interface CourseSearchContainerProps {
  currentCourses: Model.Course[];
  onChangeCourses: (courses: Model.Course[]) => void;
  onCancel: () => void;
}

const container = Model.store.connect({
  scopeTo: store => store.catalogUi,
  mapStateToProps: (scope: Model.CatalogUi, ownProps: CourseSearchContainerProps) => {
    return {
      currentCourses: ownProps.currentCourses,
      searchResults: scope.searchResults,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: CourseSearchContainerProps) => {
    return {
      onSearch: (query: string) => {},
      onCancel: ownProps.onCancel,
      onChangeCourses: ownProps.onChangeCourses,
    };
  },
})(CourseSearch);

export { container as CourseSearch };
