import * as Model from 'models';
import { Toolbox } from './toolbox';
import { SortChange } from 'components/dropzone';

const scopeDefiner = (store: Model.App) => ({
  plan: store.user.plan,
  ui: store.ui,
});

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      plan: scope.user.plan,
      showToolbox: scope.ui.showToolbox,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onChangeSort: ({ fromDropzoneId, oldIndex }: SortChange) => {
        dispatch(store =>
          store.updatePlan(plan => {
            const semester = plan.semesterMap.get(fromDropzoneId);
            if (fromDropzoneId === 'unplaced-courses') {
              return plan;
            }
            if (!semester) {
              return plan;
            }
            return plan.updateSemester(fromDropzoneId, semester => {
              const newCourses = semester._courseIds.filter((_, index) => index !== oldIndex);
              return semester.set('_courseIds', newCourses);
            });
          }),
        );
      },
    };
  },
})(Toolbox);

export { container as Toolbox };
