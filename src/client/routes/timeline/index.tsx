import * as Model from 'models';
import { Timeline, TimelineProps } from './timeline';

const scopeDefiner = (store: Model.App) => ({
  plan: store.user.plan,
});

const container = Model.store.connect({
  scopeTo: store => store.user.plan,
  mapStateToProps: (scope: Model.Plan) => {
    return {
      semesters: scope.semesters(),
    };
  },
  mapDispatchToProps: sendUpdate => {
    return {
      onCreateNewSemester: () => {
        sendUpdate(store => store.user.plan.createNewSemester().updateStore(store));
      },
      onGeneratePlan: (planOptions: Model.PlanOptions) => {
        sendUpdate(store => {
          const plan = store.user.degree.generatePlan(planOptions);
          return store.user.set('plan', plan).updateStore(store);
        });
      },
    };
  },
})(Timeline);

export { container as Timeline };
