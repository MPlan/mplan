import * as Model from 'models';
import * as Immutable from 'immutable';
import { SortEnd } from 'react-sortable-hoc';
import { Timeline } from './timeline';

const container = Model.store.connect({
  scopeTo: store => store.user.plan,
  mapStateToProps: (scope: Model.Plan) => {
    return {
      semesters: scope.semesters.toArray(),
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onCreateNewSemester: () => {
        dispatch(store => {
          const next = store.user.plan.createNewSemester();
          return Model.Plan.updateStore(store, next);
        });
      },
      onGeneratePlan: (planOptions: Model.PlanOptions) => {
        dispatch(store => {
          const next = store.user.degree.generatePlan(planOptions);
          return Model.Plan.updateStore(store, next);
        });
      },
      onReorderSemesters: (sortEnd: SortEnd, _: any) => {
        const { newIndex, oldIndex } = sortEnd;
        dispatch(store => {
          const plan = store.user.plan;
          const semesters = plan.semesters.toArray();
          const semesterBeingMoved = semesters[oldIndex];
          const semestersWithoutOldIndex = semesters.filter((_, index) => index !== oldIndex);
          const semestersWithNewIndex = [
            ...semestersWithoutOldIndex.slice(0, newIndex),
            semesterBeingMoved,
            ...semestersWithoutOldIndex.slice(newIndex, semestersWithoutOldIndex.length),
          ];

          const newSemesters = Immutable.List(semestersWithNewIndex);
          const next = plan.set('semesters', newSemesters);
          return Model.Plan.updateStore(store, next);
        });
      },
    };
  },
})(Timeline);

export { container as Timeline };
