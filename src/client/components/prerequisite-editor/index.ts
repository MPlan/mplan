import * as Model from 'models';

import { PrerequisiteEditor } from './prerequisite-editor';

interface PrerequisiteEditorContainerProps {
  open: boolean;
  course: Model.Course.Model;
  onClose: () => void;
}

const Container = Model.store.connect({
  mapStateToProps: (state, { open, course }: PrerequisiteEditorContainerProps) => {
    const { user, catalog, prerequisiteOverrides } = state;
    if (!user) throw new Error('user was falsy');

    return {
      open,
      course,
      globalOverrideExists: !!prerequisiteOverrides[Model.Course.getCatalogId(course)],
      localOverrideExists: !!user.userPrerequisiteOverrides[Model.Course.getCatalogId(course)],
      catalog,
      isAdmin: user.isAdmin,
      initialPrerequisites: Model.Course.getPrerequisitesConsideringOverrides(
        course,
        user,
        prerequisiteOverrides,
      ),
    };
  },
  mapDispatchToProps: (dispatch, { course, onClose }: PrerequisiteEditorContainerProps) => ({
    onClose,
    onSaveUser: (prerequisite: Model.Prerequisite.Model) => {
      dispatch(state => {
        const { user } = state;
        if (!user) return state;

        return {
          ...state,
          user: Model.User.addPrerequisiteOverride(
            user,
            course.subjectCode,
            course.courseNumber,
            prerequisite,
          ),
        };
      });
    },
    onRemoveUser: () => {
      dispatch(state => {
        const { user } = state;
        if (!user) return state;

        return {
          ...state,
          user: Model.User.removePrerequisiteOverride(
            user,
            course.subjectCode,
            course.courseNumber,
          ),
        };
      });
    },
    onSaveGlobal: (prerequisites: Model.Prerequisite.Model) => {},
    onRemoveGlobal: () => {},
  }),
})(PrerequisiteEditor);

export { Container as PrerequisiteEditor };
