import * as Model from 'models';
import { PrerequisiteEditor } from './prerequisite-editor';

interface PrerequisiteEditorContainerProps {
  course: Model.Course;
  open: boolean;
  onClose: () => void;
}

const container = Model.store.connect({
  scopeTo: store => store.catalog,
  mapStateToProps: (catalog: Model.Catalog, ownProps: PrerequisiteEditorContainerProps) => ({
    catalog,
    overrideAlreadyExists: false,
    ...ownProps,
  }),
  mapDispatchToProps: () => ({}),
})(PrerequisiteEditor);

export { container as PrerequisiteEditor };
