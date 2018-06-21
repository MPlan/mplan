import * as React from 'react';
import * as Model from 'models';
import { Draggable, DraggableProps } from './draggable';

export interface DraggableContainerProps {
  dropzoneActive: boolean;
  elementIndex: number;
  id: string;
  children?: JSX.Element;
}

const container = Model.store.connect({
  scopeTo: store => store.ui.draggables,
  mapStateToProps: (scope: Model.Draggables, ownProps: DraggableContainerProps) => {
    return {
      dragging: scope.dragging,
      closestElementId: scope.closestElementId,
      dropzoneActive: ownProps.dropzoneActive,
      elementIndex: ownProps.elementIndex,
      id: ownProps.id,
      selectedDraggableId: scope.selectedDraggableId,
      height: scope.height,
      children: ownProps.children,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onDragStart: ({
        height,
        selectedDraggableId,
        selectedElementId,
      }: {
        height: number;
        selectedDraggableId: string;
        selectedElementId: string;
      }) => {
        dispatch(store => {
          const nextDraggables = store.ui.draggables
            .set('dragging', true)
            .set('selectedDraggableId', selectedDraggableId)
            .set('selectedElementId', selectedElementId)
            .set('height', height);

          return Model.Draggables.updateStore(store, nextDraggables);
        });
      },
      onDragEnd: () => {
        dispatch(store => {
          const nextDraggables = store.ui.draggables.set('dragging', false);
          return Model.Draggables.updateStore(store, nextDraggables);
        });
      },
    };
  },
})(Draggable);

export { container as Draggable };
