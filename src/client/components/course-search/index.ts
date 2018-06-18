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
      totalMatches: scope.totalMatches,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: CourseSearchContainerProps) => {
    return {
      onSearch: (query: string) => {
        dispatch(store => {
          const next = store.search.search(query, 20);
          return Model.Search.updateStore(store, next);
        });
      },
      onCancel: () => {
        dispatch(store => {
          const next = store.search.clearSearch();
          return Model.Search.updateStore(store, next);
        });
        ownProps.onCancel();
      },
      onSaveCourses: (courses: Model.Course[]) => {
        dispatch(store => {
          const next = store.search.clearSearch();
          return Model.Search.updateStore(store, next);
        });
        ownProps.onSaveCourses(courses);
      },
    };
  },
})(CourseSearch);

export { container as CourseSearch };
