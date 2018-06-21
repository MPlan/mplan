import * as Model from 'models';
import { Timeline } from './timeline';

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
        sendUpdate(store => {
          const next = store.user.plan.createNewSemester();
          return Model.Plan.updateStore(store, next);
        });
      },
      onGeneratePlan: (planOptions: Model.PlanOptions) => {
        sendUpdate(store => {
          const next = store.user.degree.generatePlan(planOptions);
          return Model.Plan.updateStore(store, next);
        });
      },
    };
  },
})(Timeline);

export { container as Timeline };
