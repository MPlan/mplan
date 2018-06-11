import * as Model from 'models';
import { Timeline, TimelineProps } from './timeline';

const scopeDefiner = (store: Model.App) => ({
  plan: store.user.plan,
});

const container = Model.store.connect(Timeline)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    return {
      onCreateNewSemester: () => {
        sendUpdate(store => store.user.plan.createNewSemester().updateStore(store));
      },
      onGeneratePlan: planOptions => {
        sendUpdate(store => {
          const plan = store.user.degree.generatePlan(planOptions);
          return store.user.set('plan', plan).updateStore(store);
        });
      },
      semesters: scope.plan.semesters(),
    };
  },
});

export { container as Catalog };
