import * as Model from 'models';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import { CoursePicker, CoursePickerProps } from './course-picker';

interface CoursePickerContainerProps {
  title: string;
  open: boolean;
  courseIds: string[];
  presetCourses: { [catalogId: string]: true | undefined };
  onAdd: (catalogId: string) => void;
  onRemove: (catalogId: string) => void;
  onTogglePreset: (catalogId: string) => void;
  onRearrange: (oldIndex: number, newIndex: number) => void;
  onClose: () => void;
}

interface CoursePickerContainerInternalProps extends CoursePickerContainerProps {
  query: string;
  updateQuery: (query: string) => void;
}

const Container = compose<CoursePickerProps, CoursePickerContainerProps>(
  withState('query', 'updateQuery', ''),
  Model.store.connect({
    mapStateToProps: (state, ownProps: CoursePickerContainerInternalProps) => {
      const searchResults = Model.Catalog.getSearchResults(state.catalog, ownProps.query);

      const courses = ownProps.courseIds.map(id => state.catalog[id]).filter(x => !!x);

      return {
        title: ownProps.title,
        open: ownProps.open,
        presetCourses: ownProps.presetCourses,
        courses,
        searchResults: searchResults.slice(0, 5),
        query: ownProps.query,
        searchResultsCount: searchResults.length,
      };
    },
    mapDispatchToProps: (_, ownProps: CoursePickerContainerInternalProps) => ({
      onSearch: ownProps.updateQuery,
      onAdd: ownProps.onAdd,
      onRemove: ownProps.onRemove,
      onRearrange: ownProps.onRearrange,
      onClose: ownProps.onClose,
      onTogglePreset: ownProps.onTogglePreset,
    }),
  }),
)(CoursePicker);

export { Container as CoursePicker };
