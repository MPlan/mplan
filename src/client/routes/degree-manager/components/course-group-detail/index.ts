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
        defaultIds: [],
        recommendedIds: [],
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
        defaultIds: [],
        recommendedIds: [],
      };
    }

    return {
      name: group.name,
      descriptionHtml: group.descriptionHtml,
      creditMinimum: group.creditMinimum,
      creditMaximum: group.creditMaximum,
      defaultIds: group.defaultIds,
      recommendedIds: group.recommendedIds,
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
    onAddDefaultCourse: (catalogId: string) => {
      dispatch(state => {
        const addDefaultId = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            defaultIds: [...group.defaultIds, catalogId],
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          addDefaultId,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onRemoveDefaultCourse: (catalogId: string) => {
      dispatch(state => {
        const removeDefaultCourse = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            defaultIds: group.defaultIds.filter(id => id !== catalogId),
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          removeDefaultCourse,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onAddRecommendedCourse: (catalogId: string) => {
      dispatch(state => {
        const addRecommendedId = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            recommendedIds: [...group.recommendedIds, catalogId],
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          addRecommendedId,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onRemoveRecommendedCourse: (catalogId: string) => {
      dispatch(state => {
        const removeRecommendedCourse = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, group => ({
            ...group,
            recommendedIds: group.recommendedIds.filter(id => id !== catalogId),
          }));

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          state.masteredDegrees,
          ownProps.masteredDegreeId,
          removeRecommendedCourse,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onRearrangeDefaultCourses: (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;

      dispatch(state => {
        const rearrangeCourses = (
          group: Model.MasteredCourseGroup.Model,
        ): Model.MasteredCourseGroup.Model => {
          const { defaultIds } = group;

          const courseToMove = defaultIds[oldIndex];

          const withoutThatCourse = [
            ...defaultIds.slice(0, oldIndex),
            ...defaultIds.slice(oldIndex + 1, defaultIds.length),
          ];
          const withThatCourseButWithNewIndex = [
            ...withoutThatCourse.slice(0, newIndex),
            courseToMove,
            ...withoutThatCourse.slice(newIndex, withoutThatCourse.length),
          ];

          return {
            ...group,
            defaultIds: withThatCourseButWithNewIndex,
          };
        };

        const updateGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, rearrangeCourses);

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
    onRearrangeRecommendedCourses: (oldIndex: number, newIndex: number) => {
      if (oldIndex === newIndex) return;

      dispatch(state => {
        const rearrangeCourses = (
          group: Model.MasteredCourseGroup.Model,
        ): Model.MasteredCourseGroup.Model => {
          const { recommendedIds } = group;

          const courseToMove = recommendedIds[oldIndex];

          const withoutThatCourse = [
            ...recommendedIds.slice(0, oldIndex),
            ...recommendedIds.slice(oldIndex + 1, recommendedIds.length),
          ];
          const withThatCourseButWithNewIndex = [
            ...withoutThatCourse.slice(0, newIndex),
            courseToMove,
            ...withoutThatCourse.slice(newIndex, withoutThatCourse.length),
          ];

          return {
            ...group,
            recommendedIds: withThatCourseButWithNewIndex,
          };
        };

        const updateGroup = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.updateGroup(masteredDegree, ownProps.groupId, rearrangeCourses);

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
