import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import { Draggable } from './draggable';
import * as uuid from 'uuid/v4';
import { oneLine } from 'common-tags';
import { Subject } from 'rxjs/Subject';
import { throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
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
  initialState: {
    dropzoneActive: false,
  },
}) {
  lastDragOverTime = 0;
  containerRef: HTMLDivElement | null | undefined;
  mounted = false;
  dragOver$ = new Subject<{ clientY: number; clientX: number }>();
  dropzoneActivePoll$ = Observable.interval(100);
  dropzoneActivePollSubscription: Subscription | undefined;
  dragOverSubscription: Subscription | undefined;

  componentDidMount() {
    this.mounted = true;
    this.dragOver$.pipe(throttleTime(100)).subscribe(this.handleDragOverThrottled);
    // TODO: use rxjs to replace this polling
    this.dropzoneActivePoll$.subscribe(() => {
      if (!this.mounted) return;
      this.setState(previousState => ({
        ...previousState,
        dropzoneActive: abs(this.lastDragOverTime - new Date().getTime()) < 200,
      }));
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    super.componentWillUnmount();
    if (this.dragOverSubscription) {
      this.dragOverSubscription.unsubscribe();
    }
    if (this.dropzoneActivePollSubscription) {
      this.dropzoneActivePollSubscription.unsubscribe();
    }
  }

  handleContainerRef = (e: HTMLDivElement | null | undefined) => {
    e = this.containerRef;
  };

  handleDragOverThrottled = ({ clientY, clientX }: { clientY: number; clientX: number }) => {
    this.lastDragOverTime = new Date().getTime();

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
        midpoint: top + height / 2,
        dragId,
      }));

    let closestElementId = '';
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestY = 0;
    let aboveMidpoint = false;

    for (const { y, x, dragId, midpoint } of draggables) {
      const distance = abs(clientY - y);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElementId = dragId;
        closestY = y;
        aboveMidpoint = clientY < midpoint;
      }
    }

    if (!closestElementId) return;

    this.setStore(store =>
      store
        .set('closestElementId', closestElementId)
        .set('selectedDropzoneId', this.props.id)
        .set('aboveMidpoint', aboveMidpoint),
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

  calculateNewIndex(closestElementIndex: number) {
    if (this.store.selectedDropzoneId === this.store.startingDropzoneId) {
      if (this.store.startingIndex < closestElementIndex) {
        return closestElementIndex;
      } else {
        return closestElementIndex + 1;
      }
    }

    if (this.store.selectedDropzoneId !== this.store.startingDropzoneId) {
      return closestElementIndex + 1;
    }

    console.warn('un-hit case drop case');
    return undefined;
  }

  handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromDropzoneId = this.store.startingDropzoneId;
    const toDropzoneId = this.store.selectedDropzoneId;
    const oldIndex = this.store.startingIndex;
    const closestElementId = this.store.closestElementId;
    const closestElementIdIndex = this.props.elements.findIndex(
      element => this.props.getKey(element) === closestElementId,
    );

    const newIndex = this.calculateNewIndex(closestElementIdIndex);
    if (newIndex === undefined) return;

    if (fromDropzoneId === toDropzoneId && oldIndex === newIndex) return;

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
        <Draggable
          id={this.props.id}
          key={this.props.id}
          dropzoneActive={this.state.dropzoneActive}
          elementIndex={-1}
        />
        {this.props.elements.map((element, index) => {
          const draggableKey = this.props.getKey(element);
          return (
            <Draggable
              id={draggableKey}
              key={draggableKey}
              elementIndex={index}
              dropzoneActive={this.state.dropzoneActive}
            >
              {this.props.render(element)}
            </Draggable>
          );
        })}
      </Container>
    );
  }
}
