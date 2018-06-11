import * as React from 'react';
import * as Model from 'models';
import { Dropzone, DropzoneProps, SortChange } from './dropzone';

export interface DropzoneContainerProps<T> {
  id: string;
  elements: T[];
  getKey: (t: T) => string;
  render: (t: T) => JSX.Element;
  onChangeSort: (e: SortChange) => void;
}

const scopeDefiner = (store: Model.App) => ({
  draggables: store.ui.draggables,
});

const Container = (Model.store.connect(Dropzone)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps: _ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    const ownProps = _ownProps as DropzoneContainerProps<any>;
    return {
      closestElementId: scope.draggables.closestElementId,
      elements: ownProps.elements,
      getKey: ownProps.getKey,
      id: ownProps.id,
      render: ownProps.render,
      selectedDraggableId: scope.draggables.selectedDraggableId,
      selectedDropzoneId: scope.draggables.selectedDropzoneId,
      startingDropzoneId: scope.draggables.startingDropzoneId,
      startingIndex: scope.draggables.startingIndex,
      onChangeSort: ownProps.onChangeSort,
      onDragOver: ({ aboveMidpoint, closestElementId, selectedDropzoneId }) => {
        sendUpdate(store =>
          store.ui.draggables
            .set('closestElementId', closestElementId)
            .set('selectedDropzoneId', selectedDropzoneId)
            .set('aboveMidpoint', aboveMidpoint)
            .updateStore(store),
        );
      },
      onDragStart: ({ startingDropzoneId, startingIndex }) => {
        sendUpdate(store =>
          store.ui.draggables
            .set('startingDropzoneId', startingDropzoneId)
            .set('startingIndex', startingIndex)
            .updateStore(store),
        );
      },
    };
  },
}) as any) as React.ComponentType<DropzoneContainerProps<any>>;

function DropzoneWrapper<T>(props: DropzoneContainerProps<T>) {
  return <Container {...props} />;
}

export { DropzoneWrapper as Dropzone, SortChange };
