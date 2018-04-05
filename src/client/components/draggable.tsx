import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import * as uuid from 'uuid/v4';

const Container = styled(View)`
  position: relative;
`;

const FloatingChild = styled.div`
  position: absolute;
  z-index: 200;
  box-shadow: 0 0.4rem 1.3rem 0 rgba(12, 0, 51, 0.2);
`;
const ChildWrapper = styled.div`
  transition: all 5ms;
  &.dragging {
    transform:translateX(-9999px)
  }
`;
const Spacer = styled.div`
  transition: all 0.2s;
  max-height: 20rem;
`;

export interface DraggableProps {
  children: JSX.Element;
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

  get dragging() {
    return this.store.dragging && this.store.selectedDraggableId === this.draggableId;
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
      <Container innerRef={this.handleContainerRef}>
        <ChildWrapper
          draggable
          className={this.dragging ? 'dragging' : ''}
          innerRef={this.handleChildWrapperRef}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          {this.props.children}
        </ChildWrapper>
        {/* <Spacer
          className={this.dragging ? 'dragging' : ''}
          style={{ height: this.dragging ? this.store.height : 0 }}
        /> */}
      </Container>
    );
  }
}
