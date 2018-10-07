import * as Model from 'models';

import { DegreeSummary } from './degree-summary';

interface DegreeSummaryContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: DegreeSummaryContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    return {
      degree: masteredDegree,
    };
  },
  mapDispatchToProps: () => ({}),
})(DegreeSummary);

export { Container as DegreeSummary };
