import * as Model from 'models';
import { DegreeEditor } from './degree-editor';

const Container = Model.store.connect({
  mapStateToProps: () => ({
    masteredDegrees: [] as Model.MasteredDegree.Model[],
  }),
  mapDispatchToProps: dispatch => ({
    onCreateDegree: (degreeName: string) => {
      dispatch(state => {
        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.createNewMasteredDegree(
            state.masteredDegrees,
            degreeName,
          ),
        };
      });
    },
  }),
})(DegreeEditor);

export { Container as DegreeEditor };
