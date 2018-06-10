import * as Model from 'models';
import { DegreeEditor, DegreeEditorProps } from './degree-editor';
import { RouteComponentProps } from 'react-router-dom';

const scopeDefiner = (store: Model.App) => ({
  masteredDegrees: store.masteredDegrees,
});

export interface DegreeEditorContainerProps extends RouteComponentProps<{}> {}

const container = Model.store.connect(DegreeEditor)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps: _ownProps }) => {
    const ownProps = _ownProps as DegreeEditorContainerProps;
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    return {
      ...ownProps,
      masteredDegrees: scope.masteredDegrees
        .valueSeq()
        .sortBy(masteredDegree => masteredDegree.name)
        .toArray(),
      onCreateMasteredDegree: () => {
        sendUpdate(store => store.createMasteredDegree());
      },
      onCreateMasteredDegreeGroup: masteredDegree => {
        sendUpdate(store => masteredDegree.createNewGroup().updateStore(store));
      },
      onMasteredDegreeUpdate: (masteredDegree, update) => {
        sendUpdate(store => {
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
});

export { container as DegreeEditor };
