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
      history.replace('/degree-editor');
      return;
    }

    return {
      masteredDegree,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: DegreeEditorContainerProps) => ({
    onBackClick: () => {
      if (history.length <= 0) return;
      history.goBack();
    },
    onEditDegreeName: (newName: string) => {
      dispatch(state => {
        const newState = {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            masteredDegree => ({ ...masteredDegree, name: newName }),
          ),
        };
        console.log(newState);
        return newState;
      });
    },
  }),
})(DegreeDetail);

export { Container as DegreeDetail };
