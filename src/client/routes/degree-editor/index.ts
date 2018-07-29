import * as Model from 'models';
import * as Immutable from 'immutable';
import { DegreeEditor } from './degree-editor';
import { RouteComponentProps } from 'react-router-dom';

export interface DegreeEditorContainerProps extends RouteComponentProps<{}> {}

const container = Model.store.connect({
  scopeTo: store => store.masteredDegrees,
  mapStateToProps: (
    scope: Immutable.Map<string, Model.MasteredDegree>,
    ownProps: DegreeEditorContainerProps,
  ) => {
    return {
      ...ownProps,
      masteredDegrees: scope
        .valueSeq()
        .sortBy(masteredDegree => masteredDegree.name)
        .toArray(),
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onCreateMasteredDegree: () => {
        dispatch(store => store.createMasteredDegree());
      },
      onCreateMasteredDegreeGroup: (masteredDegree: Model.MasteredDegree) => {
        dispatch(store => {
          const next = masteredDegree.createNewGroup();
          return Model.MasteredDegree.updateStore(store, next);
        });
      },
      onMasteredDegreeUpdate: (
        masteredDegree: Model.MasteredDegree,
        update: (degree: Model.MasteredDegree) => Model.MasteredDegree,
      ) => {
        dispatch(store => {
          const thisMasteredDegree = store.masteredDegrees.get(masteredDegree.id);
          if (!thisMasteredDegree) {
            console.warn(`mastered degree with id "${masteredDegree.id}" not found`);
            return store;
          }
          return store.update('masteredDegrees', masteredDegrees =>
            masteredDegrees.update(masteredDegree.id, update),
          );
        });
      },
    };
  },
})(DegreeEditor);

export { container as DegreeEditor };
