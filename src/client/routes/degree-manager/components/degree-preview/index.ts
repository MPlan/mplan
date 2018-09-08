import * as Model from 'models';
import { Degree } from 'components/degree/degree';

interface DegreePreviewProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (store, ownProps: DegreePreviewProps) => {
    const { masteredDegrees } = store;
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      masteredDegrees,
      ownProps.masteredDegreeId,
    );

    const degreeName = (masteredDegree && masteredDegree.name) || '';

    return {
      degreeName,
    };
  },
  mapDispatchToProps: () => ({}),
})(Degree);

export { Container as DegreePreview };
