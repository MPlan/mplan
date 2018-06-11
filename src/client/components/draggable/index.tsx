import * as React from 'react';
import * as Model from 'models';
import { Draggable, DraggableProps } from './draggable';

export interface DraggableContainerProps<T> {
  dropzoneActive: boolean;
  elementIndex: number;
  id: string;
}

const scopeDefiner = (store: Model.App) => ({
  draggables: store.ui.draggables,
});

const Container = (Model.store.connect(Draggable)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps: _ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    const ownProps = _ownProps as DraggableContainerProps<any>;
    return {
      dragging: scope.draggables.dragging,
      closestElementId: scope.draggables.closestElementId,
      dropzoneActive: ownProps.dropzoneActive,
      elementIndex: ownProps.elementIndex,
      id: ownProps.id,
      selectedDraggableId: scope.draggables.selectedDraggableId,
      height: scope.draggables.height,
      onDragStart: ({ height, selectedDraggableId, selectedElementId }) => {
        sendUpdate(store =>
          store.ui.draggables
            .set('dragging', true)
            .set('selectedDraggableId', selectedDraggableId)
            .set('selectedElementId', selectedElementId)
            .set('height', height)
            .updateStore(store),
        );
      },
      onDragEnd: () => {
        sendUpdate(store => store.ui.draggables.set('dragging', false).updateStore(store));
      },

    };
  },
}) as any) as React.ComponentType<DraggableContainerProps<any>>;

function DraggableWrapper<T>(props: DraggableContainerProps<T>) {
  return <Container {...props} />;
}

export { DraggableWrapper as Draggable };
