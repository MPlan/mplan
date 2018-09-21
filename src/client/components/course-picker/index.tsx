import * as Model from 'models';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import { CoursePicker } from './course-picker';

interface CoursePickerContainerProps {
  title: string;
  open: boolean;
  courseIds: string[];
  onAdd: (catalogId: string) => void;
  onRemove: (catalogId: string) => void;
}

interface CoursePickerContainerInternalProps extends CoursePickerContainerProps {
  query: string;
  updateQuery: (query: string) => void;
}

const Container = (compose(
  withState('query', 'updateQuery', ''),
  Model.store.connect({
    mapStateToProps: (state, ownProps: CoursePickerContainerInternalProps) => {
      const searchResults = Model.Catalog.getSearchResults(state.catalog, ownProps.query);

      const courses = ownProps.courseIds.map(id => state.catalog[id]).filter(x => !!x);

      return {
        title: ownProps.title,
        open: ownProps.open,
        courses,
        searchResults: searchResults.slice(0, 20),
      };
    },
    mapDispatchToProps: (_, ownProps: CoursePickerContainerInternalProps) => ({
      onSearch: ownProps.updateQuery,
      onAdd: ownProps.onAdd,
      onRemove: ownProps.onRemove,
      onRearrange: (oldIndex: number, newIndex: number) => {},
    }),
  }),
)(CoursePicker as any) as any) as React.ComponentType<CoursePickerContainerProps>;

export { Container as CoursePicker };
