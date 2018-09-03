import * as Model from 'models';
import { DegreeEditor } from './degree-editor';
import { saveMasteredDegree } from 'client/fetch/mastered-degrees';

const Container = Model.store.connect({
  mapStateToProps: () => ({
    masteredDegrees: [] as Model.MasteredDegree.Model[],
  }),
  mapDispatchToProps: dispatch => ({
    onCreateDegree: (degreeName: string) => {
      dispatch(state => {
        const lastPosition = Model.MasteredDegrees.getLastPosition(state.masteredDegrees);
        const newDegree = Model.MasteredDegree.createNewMasteredDegree(degreeName, lastPosition);
        console.log({ newDegree });

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
  }),
})(DegreeEditor);

export { Container as DegreeEditor };
