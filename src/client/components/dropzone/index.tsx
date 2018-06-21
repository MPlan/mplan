import * as React from 'react';
import * as Model from 'models';
import { Dropzone, SortChange } from './dropzone';

export interface DropzoneContainerProps<T> {
  id: string;
  elements: T[];
  getKey: (t: T) => string;
  render: (t: T) => JSX.Element;
  onChangeSort: (e: SortChange) => void;
}

const Container = Model.store.connect({
  scopeTo: store => store.ui.draggables,
  mapStateToProps: (scope: Model.Draggables, ownProps: DropzoneContainerProps<any>) => {
    return {
      closestElementId: scope.closestElementId,
      elements: ownProps.elements,
      getKey: ownProps.getKey,
      id: ownProps.id,
      render: ownProps.render,
      selectedDraggableId: scope.selectedDraggableId,
      selectedDropzoneId: scope.selectedDropzoneId,
      startingDropzoneId: scope.startingDropzoneId,
      startingIndex: scope.startingIndex,
      onChangeSort: ownProps.onChangeSort,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onDragOver: ({
        aboveMidpoint,
        closestElementId,
        selectedDropzoneId,
      }: {
        aboveMidpoint: boolean;
        closestElementId: string;
        selectedDropzoneId: string;
      }) => {
        dispatch(store => {
          const nextDraggables = store.ui.draggables
            .set('closestElementId', closestElementId)
            .set('selectedDropzoneId', selectedDropzoneId)
            .set('aboveMidpoint', aboveMidpoint);

          return Model.Draggables.updateStore(store, nextDraggables);
        });
      },
      onDragStart: ({
        startingDropzoneId,
        startingIndex,
      }: {
        startingDropzoneId: string;
        startingIndex: number;
      }) => {
        dispatch(store => {
          const nextDraggables = store.ui.draggables
            .set('startingDropzoneId', startingDropzoneId)
            .set('startingIndex', startingIndex);
          return Model.Draggables.updateStore(store, nextDraggables);
        });
      },
    };
  },
})(Dropzone);

function DropzoneWrapper<T>(props: DropzoneContainerProps<T>) {
  return <Container {...props} />;
}

export { DropzoneWrapper as Dropzone, SortChange };
