import * as Model from 'models';
import { PrerequisiteEditor } from './prerequisite-editor';

interface PrerequisiteEditorContainerProps {
  course: Model.Course;
  open: boolean;
  onClose: () => void;
}

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (store: Model.App, ownProps: PrerequisiteEditorContainerProps) => ({
    catalog: store.catalog,
    globalOverrideExists: true,
    localOverrideExists: !!store.user.userPrerequisiteOverrides[ownProps.course.catalogId],
    isAdmin: store.user.isAdmin,
    ...ownProps,
  }),
  mapDispatchToProps: dispatch => ({
    onSaveUser: (course: Model.Course, prerequisite: Model.Prerequisite) => {
      dispatch(store => {
        const next = store.user.setPrerequisiteOverride(course, prerequisite);
        return Model.User.updateStore(store, next);
      });
    },
    onSaveGlobal: (course: Model.Course, prerequisite: Model.Prerequisite) => {},
    onRemoveUser: (course: Model.Course) => {
      dispatch(store => {
        const next = store.user.removePrerequisiteOverride(course);
        return Model.User.updateStore(store, next);
      });
    },
    onRemoveGlobal: (course: Model.Course) => {},
  }),
})(PrerequisiteEditor);

export { container as PrerequisiteEditor };
