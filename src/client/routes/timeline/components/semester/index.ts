import * as Model from 'models';
import { Semester } from './semester';
import { SortChange } from 'components/dropzone';

export interface SemesterContainerProps {
  semester: Model.Semester;
}

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (_: any, ownProps: SemesterContainerProps) => {
    return {
      semester: ownProps.semester,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: SemesterContainerProps) => {
    return {
      onAddCourses: (courses: Model.Course[]) => {
        dispatch(store => {
          const next = store.user.plan.updateSemester(ownProps.semester.id, semester =>
            courses.reduce((semester, courseToAdd) => semester.addCourse(courseToAdd), semester),
          );

          return Model.Plan.updateStore(store, next);
        });
      },
      onDeleteCourse: (course: Model.Course) => {
        dispatch(store =>
          store.updatePlan(plan =>
            plan.updateSemester(ownProps.semester.id, semester => semester.deleteCourse(course)),
          ),
        );
      },
      onClearCourses: () => {
        dispatch(store => {
          const next = store.user.plan.updateSemester(ownProps.semester.id, semester =>
            semester.clearCourses(),
          );

          return Model.Plan.updateStore(store, next);
        });
      },
      onSortEnd: ({ fromDropzoneId, newIndex, oldIndex, toDropzoneId }: SortChange) => {
        dispatch(store =>
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
})(Semester);

export { container as Semester };
