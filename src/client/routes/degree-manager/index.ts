import * as Model from 'models';
import { DegreeEditor } from './degree-manager';
import { saveMasteredDegree } from 'client/fetch/mastered-degrees';
import { history } from 'client/history';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    locationPathname: history.location.pathname,
    masteredDegrees: Model.MasteredDegrees.getAsArray(state.masteredDegrees),
  }),
  mapDispatchToProps: dispatch => ({
    onCreateDegree: (degreeName: string) => {
      dispatch(state => {
        const lastPosition = Model.MasteredDegrees.getLastPosition(state.masteredDegrees);
        const newDegree = Model.MasteredDegree.createNewMasteredDegree(degreeName, lastPosition);

        saveMasteredDegree(newDegree).then(() =>
          dispatch(state => ({ ...state, saveCount: state.saveCount - 1 })),
        );

        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.addMasteredDegree(
            state.masteredDegrees,
            newDegree,
          ),
          saveCount: state.saveCount + 1,
        };
      });
    },
    onMasteredDegreeClick: (masteredDegreeId: string) => {
      history.push(`/degree-manager/${masteredDegreeId}`);
    },
  }),
})(DegreeEditor);

export { Container as DegreeEditor };
