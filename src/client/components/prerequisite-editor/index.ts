import * as Model from 'models';
import { PrerequisiteEditor } from './prerequisite-editor';
import { Auth } from 'client/auth';
import { dispatchSaving, dispatchDoneSaving } from 'client/models';

async function addOverride(course: Model.Course, prerequisites: Model.Prerequisite) {
  const token = await Auth.token();
  const prerequisiteOverridesResponse = await fetch('/api/prerequisite-overrides/', {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  const currentPrerequisiteOverrides = (await prerequisiteOverridesResponse.json()) as {
    [catalogId: string]: Model.Prerequisite;
  };

  const courseExists = !!currentPrerequisiteOverrides[course.catalogId];

  if (courseExists) {
    await fetch(`/api/prerequisite-overrides/${course.catalogId}`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ courseKey: course.catalogId, prerequisites }),
    });
  } else {
    await fetch(`/api/prerequisite-overrides/`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ courseKey: course.catalogId, prerequisites }),
    });
  }
}

interface PrerequisiteEditorContainerProps {
  course: Model.Course;
  open: boolean;
  onClose: () => void;
}

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (store: Model.App, ownProps: PrerequisiteEditorContainerProps) => ({
    catalog: store.catalog,
    globalOverrideExists: !!store.prerequisiteOverrides[ownProps.course.catalogId],
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
      Model.Course.clearMemos();
      Model.Degree.clearMemos();
    },
    onSaveGlobal: async (course: Model.Course, prerequisite: Model.Prerequisite) => {
      dispatch(store => store.addPrerequisiteOverride(course, prerequisite));
      dispatchSaving();
      await addOverride(course, prerequisite);
      dispatchDoneSaving();
    },
    onRemoveUser: (course: Model.Course) => {
      dispatch(store => {
        const next = store.user.removePrerequisiteOverride(course);
        return Model.User.updateStore(store, next);
      });
      Model.Course.clearMemos();
      Model.Degree.clearMemos();
    },
    onRemoveGlobal: async (course: Model.Course) => {
      dispatch(store => store.removePrerequisiteOverride(course));
    },
  }),
})(PrerequisiteEditor);

export { container as PrerequisiteEditor };
