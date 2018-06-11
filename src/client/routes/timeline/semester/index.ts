import * as Model from 'models';
import { Semester, SemesterProps } from './semester';

const scopeDefiner = (store: Model.App) => ({});

export interface SemesterContainerProps {
  semester: Model.Semester;
}

const container = (Model.store.connect(Semester)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps: _ownProps }) => {
    const ownProps = _ownProps as SemesterContainerProps;
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    const catalogUi = store.catalogUi;
    return {
      semester: ownProps.semester,
      onDeleteCourse: course => {
        sendUpdate(store =>
          store.updatePlan(plan =>
            plan.updateSemester(ownProps.semester.id, semester => semester.deleteCourse(course)),
          ),
        );
      },
      onSortEnd: ({ fromDropzoneId, newIndex, oldIndex, toDropzoneId }) => {
        sendUpdate(store =>
          store.updatePlan(plan => {
            const semester = plan.semesterMap.get(fromDropzoneId);
            if (fromDropzoneId === 'unplaced-courses') {
              const course = plan.unplacedCourses()[oldIndex];
              return plan.updateSemester(toDropzoneId, semester => {
                const newCourses = semester._courseIds.insert(newIndex, course.catalogId);
                return semester.set('_courseIds', newCourses);
              });
            }
            if (!semester) {
              return plan;
            }
            const course = semester._courseIds.get(oldIndex);
            if (!course) {
              console.warn('course was not found when sorting');
              return plan;
            }
            return plan
              .updateSemester(fromDropzoneId, semester => {
                const newCourses = semester._courseIds.filter((_, index) => index !== oldIndex);
                return semester.set('_courseIds', newCourses);
              })
              .updateSemester(toDropzoneId, semester => {
                const newCourses = semester._courseIds.insert(newIndex, course);
                return semester.set('_courseIds', newCourses);
              });
          }),
        );
      },
    };
  },
}) as any) as React.ComponentType<SemesterContainerProps>;

export { container as Semester };
