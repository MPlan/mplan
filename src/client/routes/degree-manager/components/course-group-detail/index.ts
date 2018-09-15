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
      };
    }

    const group = Model.MasteredDegree.getCourseGroup(masteredDegree, ownProps.groupId);
    if (!group) {
      history.replace(`/degree-manager/${masteredDegree.id}`);
      return {
        name: '',
      };
    }

    return {
      name: group.name,
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
    onBackClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}`);
    },
    onPreviewClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}/preview`);
    },
  }),
})(CourseGroupDetail);

export { Container as CourseGroupDetail };
