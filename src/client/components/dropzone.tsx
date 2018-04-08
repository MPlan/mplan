import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import { Draggable } from './draggable';
import * as uuid from 'uuid/v4';
import { oneLine } from 'common-tags';
import { Subject } from 'rxjs/Subject';
import { throttleTime } from 'rxjs/operators';
const { abs } = Math;

export interface ContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  dragging?: boolean;
}
const Container = styled<ContainerProps>(View)`
  flex: 1;
`;

export interface SortChange {
  fromDropzoneId: string;
  toDropzoneId: string;
  /** element's old index within old parent */
  oldIndex: number;
  /** element's new index within new parent */
  newIndex: number;
}

export interface DropzoneProps<T> {
  id: string;
  elements: T[];
  getKey: (t: T) => string;
  render: (t: T) => JSX.Element;
  onChangeSort: (sortChange: SortChange) => void;
}

export class Dropzone extends Model.store.connect({
  scope: store => store.ui.draggables,
  descope: (store, draggables: Model.Draggables) =>
    store.updateUi(ui => ui.set('draggables', draggables)),
  propsExample: (undefined as any) as DropzoneProps<Model.Course>,
}) {
  containerRef: HTMLDivElement | null | undefined;
  dragOver$ = new Subject<{ clientY: number; clientX: number }>();

  componentDidMount() {
    this.dragOver$.pipe(throttleTime(300)).subscribe(this.handleDragOverThrottled);
  }

  handleContainerRef = (e: HTMLDivElement | null | undefined) => {
    e = this.containerRef;
  };

  handleDragOverThrottled = ({ clientY, clientX }: { clientY: number; clientX: number }) => {
    const draggables = Array.from(
      document.querySelectorAll(oneLine`
          .dropzone-${this.props.id}
          .draggable:not(.draggable-${this.store.selectedDraggableId})
          .drag
        `),
    )
      .map(draggable => {
        const match = /drag-id-(\S*)/.exec(draggable.className);
        if (!match) return undefined;
        const rect = draggable.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          dragId: match[1],
        };
      })
      .filter(x => !!x)
      .map(x => x!)
      .map(({ top, left, width, height, dragId }) => ({
        y: top + height,
        x: left + width / 2,
        dragId,
      }));

    let closestElementId = '';
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestY = 0;

    for (const { y, x, dragId } of draggables) {
      const distance = abs(clientY - y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElementId = dragId;
        closestY = y;
      }
    }

    if (!closestElementId) return;

    const direction = /*if*/ clientY < closestY ? 'top' : 'bottom';

    this.setStore(store =>
      store
        .set('closestElementId', closestElementId)
        .set('direction', direction)
        .set('selectedDropzoneId', this.props.id),
    );
  };

  handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const match = /drag-id-(\S*)/.exec(target.className);
    if (!match) return;
    const id = match[1];
    const startingIndex = this.props.elements.findIndex(
      element => this.props.getKey(element) === id,
    );
    this.setStore(store =>
      store.set('startingDropzoneId', this.props.id).set('startingIndex', startingIndex),
    );
  };

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clientY = e.clientY;
    const clientX = e.clientX;
    this.dragOver$.next({ clientY, clientX });
  };

  handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('drop');
    e.preventDefault();
    const fromDropzoneId = this.store.startingDropzoneId;
    const toDropzoneId = this.store.selectedDropzoneId;
    const oldIndex = this.store.startingIndex;
    const closestElementId = this.store.closestElementId;
    const closestElementIdIndex = this.props.elements.findIndex(
      element => this.props.getKey(element) === closestElementId,
    );

    if (closestElementIdIndex <= -1) return;
    const newIndex =
      this.store.direction === 'top' ? closestElementIdIndex : closestElementIdIndex;

    this.props.onChangeSort({
      fromDropzoneId,
      toDropzoneId,
      oldIndex,
      newIndex,
    });
  };

  render() {
    return (
      <Container
        innerRef={this.handleContainerRef}
        className={`dropzone dropzone-${this.props.id}`}
        onDragStart={this.handleDragStart}
        onDrop={this.handleDrop}
        onDragOver={this.handleDragOver}
      >
        {this.props.elements.map(element => {
          const draggableKey = this.props.getKey(element);
          return (
            <Draggable id={draggableKey} key={draggableKey}>
              {this.props.render(element)}
            </Draggable>
          );
        })}
      </Container>
    );
  }
}
