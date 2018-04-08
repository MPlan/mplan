import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import * as uuid from 'uuid/v4';
import * as styles from '../styles';

const Container = styled(View)`
  position: relative;
  flex-shrink: 0;
`;
const FloatingChild = styled.div`
  position: absolute;
  z-index: 200;
  box-shadow: 0 0.4rem 1.3rem 0 rgba(12, 0, 51, 0.2);
`;
const ChildWrapper = styled.div`
  transition: all 5ms;
  max-height: 30rem;
  &.dragging {
    max-height: 0;
    opacity: 0;
  }
`;
const Spacer = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.grayLighter};
  max-height: 20rem;
  box-shadow: inset 0 0 1rem 0 rgba(12, 0, 51, 0.1);
  transition: all 0.12s;
`;

export interface DraggableProps {
  id: string;
  elementIndex: number;
  dropzoneActive: boolean;
  children?: JSX.Element;
}

export class Draggable extends Model.store.connect({
  scope: store => store.ui.draggables,
  descope: (store: Model.App, draggables: Model.Draggables) =>
    store.updateUi(ui => ui.set('draggables', draggables)),
  propsExample: (undefined as any) as DraggableProps,
}) {
  draggableId = uuid();
  childWrapperRef: HTMLElement | null | undefined;
  containerRef: HTMLElement | null | undefined;

  componentDidMount() {}

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  get draggingCurrent() {
    return this.store.dragging && this.store.selectedDraggableId === this.draggableId;
  }

  get spacer() {
    if (!this.props.dropzoneActive) return false;
    if (!this.store.dragging) return false;
    if (this.store.closestElementId !== this.props.id) return false;
    return true;
  }

  handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text', this.draggableId);
    console.log('drag start');
    const childWrapperRef = this.childWrapperRef;
    const childHeight = childWrapperRef && childWrapperRef.getBoundingClientRect().height;

    this.setStore(store =>
      store
        .set('dragging', true)
        .set('selectedDraggableId', this.draggableId)
        .set('selectedElementId', this.props.id)
        .set('height', childHeight || 0),
    );
  };

  handleDragEnd = () => {
    console.log('drag end');
    this.setStore(store => store.set('dragging', false));
  };

  handleChildWrapperRef = (e: HTMLElement | null | undefined) => {
    this.childWrapperRef = e;
  };

  handleContainerRef = (e: HTMLElement | null | undefined) => {
    this.containerRef = e;
  };

  getChildBoundingRect() {
    if (!this.childWrapperRef) return undefined;
    return this.childWrapperRef.getBoundingClientRect();
  }

  getContainerBoundingRect() {
    if (!this.containerRef) return undefined;
    return this.containerRef.getBoundingClientRect();
  }

  render() {
    return (
      <Container
        className={['draggable', `draggable-${this.draggableId}`].join(' ')}
        innerRef={this.handleContainerRef}
      >
        <ChildWrapper
          draggable
          className={[
            'drag',
            `drag-id-${this.props.id}`,
            this.draggingCurrent ? 'dragging' : '',
          ].join(' ')}
          innerRef={this.handleChildWrapperRef}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          {this.props.children}
        </ChildWrapper>
        <Spacer style={{ height: this.spacer ? this.store.height : 0 }}>Incoming!</Spacer>
      </Container>
    );
  }
}
