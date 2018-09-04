import * as Model from 'models';
import { DegreeDetail } from './degree-detail';

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
      throw new Error(`could not find mastered degree with id ${ownProps.masteredDegreeId}`);
    }

    return {
      masteredDegree,
    };
  },
  mapDispatchToProps: () => ({}),
})(DegreeDetail);

export { Container as DegreeDetail };
