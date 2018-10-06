import * as Model from 'models';
import { CourseGroupDetail } from './course-group-detail';
import { history } from 'client/history';

interface CourseGroupDetailContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: CourseGroupDetailContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    if (!masteredDegree) {
      history.replace('/degree-manager');
      return {
        name: '',
        descriptionHtml: '',
        creditMinimum: 0,
        creditMaximum: 0,
        catalogIds: [],
        presetCourses: {},
        courseValidationEnabled: false,
      };
    }

    const group = Model.MasteredDegree.getCourseGroup(masteredDegree, ownProps.groupId);
    if (!group) {
      history.replace(`/degree-manager/${masteredDegree.id}`);
      return {
        name: '',
        descriptionHtml: '',
        creditMinimum: 0,
        creditMaximum: 0,
        catalogIds: [],
        presetCourses: {},
        courseValidationEnabled: false,
      };
    }

    return {
      name: group.name,
      descriptionHtml: group.descriptionHtml,
      creditMinimum: group.creditMinimum,
      creditMaximum: group.creditMaximum,
      catalogIds: Model.RequirementGroup.getCatalogIds(group),
      presetCourses: Model.RequirementGroup.getPresetCourses(group),
      courseValidationEnabled: group.courseValidationEnabled,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: CourseGroupDetailContainerProps) => ({
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
  }),
})(CourseGroupDetail);

export { Container as CourseGroupDetail };
