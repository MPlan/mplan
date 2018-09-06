import * as Model from 'models';
import { DegreeDetail } from './degree-detail';
import { history } from 'client/history';

interface DegreeEditorContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: DegreeEditorContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    if (!masteredDegree) {
      history.replace('/degree-manager');
      return;
    }

    return {
      masteredDegree,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: DegreeEditorContainerProps) => ({
    onBackClick: () => {
      history.push('/degree-manager');
    },
    onPreview: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}/preview`);
    },
    onEditDegreeName: (newName: string) => {
      dispatch(state => {
        const newState: Model.App.Model = {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            masteredDegree => ({ ...masteredDegree, name: newName }),
          ),
        };
        return newState;
      });
    },
  }),
})(DegreeDetail);

export { Container as DegreeDetail };
