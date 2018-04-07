import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import * as uuid from 'uuid/v4';
import { oneLine } from 'common-tags';
const { sqrt, pow } = Math;

export interface ContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dragging?: boolean;
}
const Container = styled<ContainerProps>(View)`
  flex: 1;
  /* ${props => (props.dragging ? 'z-index: 1000' : '')}; */
  /* position: relative; */
`;

export interface DropzoneProps {
  children: JSX.Element;
}

export class Dropzone extends Model.store.connect({
  scope: store => store.ui.draggables,
  descope: (store, draggables: Model.Draggables) =>
    store.updateUi(ui => ui.set('draggables', draggables)),
  propsExample: (undefined as any) as DropzoneProps,
}) {
  dropzoneId = uuid();
  containerRef: HTMLDivElement | null | undefined;

  handleContainerRef = (e: HTMLDivElement | null | undefined) => {
    e = this.containerRef;
  };

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clientY = e.clientY;
    const clientX = e.clientX;
    const draggables = Array.from(
      document.querySelectorAll(oneLine`
        .dropzone-${this.dropzoneId}
        .draggable:not(.draggable-${this.store.selectedDraggableId})
      `),
    )
      .map(draggable => {
        const match = /draggable-([\w-]*)/.exec(draggable.className);
        if (!match) return undefined;
        const rect = draggable.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          draggableId: match[1],
        };
      })
      .filter(x => !!x)
      .map(x => x!)
      .map(({ top, left, width, height, draggableId }) => ({
        y: top + height / 2,
        x: left + width / 2,
        draggableId,
      }));

    let closestDraggableId = '';
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestY = 0;

    for (const { y, x, draggableId } of draggables) {
      const distance = sqrt(pow(clientY - y, 2) - pow(clientX - x, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestDraggableId = draggableId;
        closestY = y;
      }
    }

    if (!closestDraggableId) return;

    const direction = /*if*/ clientY < closestY ? 'top' : 'bottom';

    this.setStore(store =>
      store.set('closestDraggableId', closestDraggableId).set('direction', direction),
    );
  };

  render() {
    return (
      <Container
        innerRef={this.handleContainerRef}
        className={`dropzone dropzone-${this.dropzoneId}`}
        onDrop={e => {
          e.preventDefault();
          console.log('drop');
        }}
        onDragOver={this.handleDragOver}
      >
        {this.props.children}
      </Container>
    );
  }
}
