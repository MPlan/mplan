import * as React from 'react';
import * as Model from 'models';
import { CourseSearch } from './course-search';

interface CourseSearchContainerProps {
  defaultCourses: Model.Course[];
  onSaveCourses: (courses: Model.Course[]) => void;
  onCancel: () => void;
}

const container = Model.store.connect({
  scopeTo: store => store.search,
  mapStateToProps: (scope: Model.Search, ownProps: CourseSearchContainerProps) => {
    return {
      defaultCourses: ownProps.defaultCourses,
      searchResults: scope.searchResults,
      totalMatches: 0,
      onCancel: ownProps.onCancel,
      onSaveCourses: ownProps.onSaveCourses,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onSearch: (query: string) => {
        dispatch(store => {
          const next = store.search.search(query, 20);
          return Model.Search.updateStore(store, next);
        });
      },
    };
  },
})(CourseSearch);

export { container as CourseSearch };
