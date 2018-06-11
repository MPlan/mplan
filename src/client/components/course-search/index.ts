import * as React from 'react';
import * as Model from 'models';
import { CourseSearch } from './course-search';

interface CourseSearchContainerProps {
  currentCourses: Model.Course[];
  onChangeCourses: (courses: Model.Course[]) => void;
  onCancel: () => void;
}

const scopeDefiner = (store: Model.App) => ({
  catalogUi: store.catalogUi,
});

const container = (Model.store.connect(CourseSearch)({
  scopeDefiner,
  mapScopeToProps: ({ scope: _scope, ownProps: _ownProps, sendUpdate }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    const ownProps = _ownProps as CourseSearchContainerProps;

    return {
      currentCourses: ownProps.currentCourses,
      searchResults: scope.catalogUi.searchResults,
      onSearch: query => {
        sendUpdate(store => store.catalogUi.search(query).updateStore(store));
      },
      onCancel: ownProps.onCancel,
      onChangeCourses: ownProps.onChangeCourses,
    };
  },
}) as any) as React.ComponentType<CourseSearchContainerProps>;

export { container as CourseSearch };
