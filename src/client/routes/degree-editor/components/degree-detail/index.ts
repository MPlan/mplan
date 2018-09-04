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
  mapDispatchToProps: () => ({}),
})(DegreeDetail);

export { Container as DegreeDetail };
