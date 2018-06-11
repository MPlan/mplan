import * as Model from 'models';
import { Toolbox } from './toolbox';

const scopeDefiner = (store: Model.App) => ({
  plan: store.user.plan,
  ui: store.ui,
});

const container = Model.store.connect(Toolbox)({
  scopeDefiner,
  mapScopeToProps: ({ scope: _scope, sendUpdate }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    return {
      plan: scope.plan,
      showToolbox: scope.ui.showToolbox,
      onChangeSort: ({ fromDropzoneId, oldIndex }) => {
        sendUpdate(store =>
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
});

export { container as Toolbox };
