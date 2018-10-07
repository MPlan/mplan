import * as Model from 'models';
import { RequirementGroupDetail } from './requirement-group-detail';
import { history } from 'client/history';

interface RequirementGroupDetailContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: RequirementGroupDetailContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    const emptyProps = {
      masteredDegreeId: ownProps.masteredDegreeId,
      groupId: ownProps.groupId,
      name: '',
      descriptionHtml: '',
      creditMinimum: 0,
      creditMaximum: 0,
      catalogIds: [],
      presetCourses: {},
      courseValidationEnabled: false,
    };

    if (!masteredDegree) {
      history.replace('/degree-manager');
      return emptyProps;
    }

    if (!ownProps.groupId) {
      history.replace(`/degree-manager/${masteredDegree.id}`);
      return emptyProps;
    }

    const group = Model.MasteredDegree.getGroup(masteredDegree, ownProps.groupId);
    if (!group) {
      history.replace(`/degree-manager/${masteredDegree.id}`);
      return emptyProps;
    }

    return {
      masteredDegreeId: ownProps.masteredDegreeId,
      groupId: ownProps.groupId,
      name: group.name,
      descriptionHtml: group.descriptionHtml,
      creditMinimum: group.creditMinimum,
      creditMaximum: group.creditMaximum,
      catalogIds: group.courses,
      presetCourses: group.presetCourses,
      courseValidationEnabled: group.courseValidationEnabled,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: RequirementGroupDetailContainerProps) => ({
    onNameChange: (name: string) => {
      dispatch(state => {
        const changeName = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            name,
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          changeName,
        );

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
    onDescriptionChange: (descriptionHtml: string) => {
      dispatch(state => {
        const changeName = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            descriptionHtml,
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          changeName,
        );

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
    onCreditMinimumChange: (creditMinimum: number) => {
      dispatch(state => {
        const changeMinimum = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            creditMinimum,
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          changeMinimum,
        );

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
    onCreditMaximumChange: (creditMaximum: number) => {
      dispatch(state => {
        const changeMaximum = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            creditMaximum,
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          changeMaximum,
        );

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
    onBackClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}`);
    },
    onPreviewClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}/preview`);
    },
    onAddCourse: (catalogId: string) => {
      dispatch(state => {
        const addCourse = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group =>
            Model.RequirementGroup.addCourse(group, catalogId),
          );

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          addCourse,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onRemoveCourse: (catalogId: string) => {
      dispatch(state => {
        const removeCourse = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group =>
            Model.RequirementGroup.removeCourse(group, catalogId),
          );

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          removeCourse,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onRearrangeCourses: (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;

      dispatch(state => {
        const updateGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group =>
            Model.RequirementGroup.rearrangeCourses(group, oldIndex, newIndex),
          );

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          updateGroup,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onTogglePreset: (catalogId: string) => {
      dispatch(state => {
        const updateGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group =>
            Model.RequirementGroup.togglePreset(group, catalogId),
          );

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          updateGroup,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onToggleCourseValidation: () => {
      dispatch(state => {
        const updateGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            courseValidationEnabled: !group.courseValidationEnabled,
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          updateGroup,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onDelete: () => {
      dispatch(state => {
        const deleteGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.deleteGroup(masteredDegree, ownProps.groupId);

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          deleteGroup,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
  }),
})(RequirementGroupDetail);

export { Container as RequirementGroupDetail };
