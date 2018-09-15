import * as Model from 'models';
import { DegreeDetail } from './degree-detail';
import { history } from 'client/history';

interface DegreeEditorContainerProps {
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: DegreeEditorContainerProps) => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );

    if (!masteredDegree) {
      history.replace('/degree-manager');
      return;
    }

    return {
      id: ownProps.masteredDegreeId,
      name: masteredDegree.name,
      descriptionHtml: masteredDegree.descriptionHtml,
      published: masteredDegree.published,
      minimumCreditHours: masteredDegree.minimumCredits,
    };
  },
  mapDispatchToProps: (dispatch, ownProps: DegreeEditorContainerProps) => ({
    onMount: () => {
      dispatch(state => {
        return {
          ...state,
          watchedMasteredDegrees: {
            ...state.watchedMasteredDegrees,
            [ownProps.masteredDegreeId]: true,
          },
        };
      });
    },
    onWillUnmount: () => {
      dispatch(state => {
        return {
          ...state,
          watchedMasteredDegrees: Object.keys(state.watchedMasteredDegrees)
            .filter(id => id !== ownProps.masteredDegreeId)
            .reduce(
              (watchedMasteredDegrees, masteredDegreeId) => {
                watchedMasteredDegrees[masteredDegreeId] = true;
                return watchedMasteredDegrees;
              },
              {} as { [masteredDegreeId: string]: true },
            ),
        };
      });
    },
    onBackClick: () => {
      history.push('/degree-manager');
    },
    onPreview: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}/preview`);
    },
    onEditDegreeName: (newName: string) => {
      dispatch(state => {
        const newState: Model.App.Model = {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            masteredDegree => ({ ...masteredDegree, name: newName }),
          ),
        };
        return newState;
      });
    },
    onPublishChange: (published: boolean) => {
      dispatch(state => {
        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.updatedMasteredDegree(
            state.masteredDegrees,
            ownProps.masteredDegreeId,
            masteredDegree => ({ ...masteredDegree, published }),
          ),
        };
      });
    },
    onDescriptionChange: (description: string) => {
      dispatch(state => {
        const { masteredDegrees } = state;
        const { masteredDegreeId } = ownProps;

        const changeDescription = (mastedDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.changeDescription(mastedDegree, description);

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          masteredDegrees,
          masteredDegreeId,
          changeDescription,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
    onMinimumCreditHoursChange: (minimumCreditHours: number) => {
      dispatch(state => {
        const { masteredDegrees } = state;
        const { masteredDegreeId } = ownProps;

        const changeMinimumCreditHours = (masteredDegree: Model.MasteredDegree.Model) =>
          Model.MasteredDegree.changeMinimumCredits(masteredDegree, minimumCreditHours);

        const newMasteredDegrees = Model.MasteredDegrees.updatedMasteredDegree(
          masteredDegrees,
          masteredDegreeId,
          changeMinimumCreditHours,
        );

        return {
          ...state,
          masteredDegrees: newMasteredDegrees,
        };
      });
    },
  }),
})(DegreeDetail);

export { Container as DegreeDetail };
