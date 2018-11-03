import * as Model from 'models';
import { history } from 'client/history';
import { ObjectId } from 'utilities/object-id';

import { NewDegreeModal } from './new-degree-modal';

interface NewDegreeModalContainerProps {
  open: boolean;
  onClose: () => void;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: NewDegreeModalContainerProps) => {
    return {
      open: ownProps.open,
      existingDegrees: Model.MasteredDegrees.getAsArray(state.masteredDegrees) as Array<{
        id: string;
        name: string;
      }>,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: NewDegreeModalContainerProps) => ({
    onClose: ownProps.onClose,
    onCreateDegreeFromExisting: (id: string) => {
      dispatch(state => {
        const existingMasteredDegree = Model.MasteredDegrees.getMasteredDegree(
          state.masteredDegrees,
          id,
        );

        if (!existingMasteredDegree) return state;

        const newDegree: Model.MasteredDegree.Model = {
          ...existingMasteredDegree,
          id: ObjectId(),
          name: `${existingMasteredDegree.name} (copy)`,
          published: false,
        };
        const newMasteredDegrees = Model.MasteredDegrees.addMasteredDegree(
          state.masteredDegrees,
          newDegree,
        );

        history.push(`/degree-manager/${newDegree.id}`);

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
    onCreateNewDegree: (name: string) => {
      dispatch(state => {
        const lastPosition = Model.MasteredDegrees.getLastPosition(state.masteredDegrees);

        const id = ObjectId();

        const newMasteredDegrees = Model.MasteredDegrees.addMasteredDegree(
          state.masteredDegrees,
          Model.MasteredDegree.createNewMasteredDegree(name, lastPosition, id),
        );

        history.push(`/degree-manager/${id}`);

        return { ...state, masteredDegrees: newMasteredDegrees };
      });
    },
  }),
})(NewDegreeModal);

export { Container as NewDegreeModal };
