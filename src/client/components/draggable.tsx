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
  box-shadow: 0 0.4rem 1.3rem 0 rgba(12, 0, 51, 0.20);
`;
const ChildWrapper = styled.div`
  transition: all 0.2s;
  &.dragging {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
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

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  get dragging() {
    return this.store.dragging && this.store.selectedDraggableId === this.draggableId;
  }

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const y = e.clientY;
    const x = e.clientX;
    const childBoundingRect = this.getChildBoundingRect();
    const containerBoundingRect = this.getContainerBoundingRect();

    const childTop = childBoundingRect && childBoundingRect.top || 0;
    const containerTop = containerBoundingRect && containerBoundingRect.top || 0;
    const childLeft = childBoundingRect && childBoundingRect.left || 0;
    const containerLeft = containerBoundingRect && containerBoundingRect.left || 0;
    this.setStore(store =>
      store
        .set('mouseDown', true)
        .set('selectedDraggableId', this.draggableId)
        .set('startY', y)
        .set('startX', x)
        .set('currentY', y)
        .set('currentX', x)
        .set('offsetY', y - childTop + containerTop)
        .set('offsetX', x - childLeft + containerLeft)
        .set('childHeight', childBoundingRect && childBoundingRect.height)
        .set('childWidth', childBoundingRect && childBoundingRect.width),
    );
  };
  handleMouseUp = () => {
    this.setStore(store => store.set('mouseDown', false));
  };
  handleMouseMove = (e: MouseEvent) => {
    if (!this.store.mouseDown) return;
    const y = e.clientY;
    const x = e.clientX;
    this.setStore(store => store.set('currentY', y).set('currentX', x));
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
      <Container innerRef={this.handleContainerRef} onMouseDown={this.handleMouseDown}>
        {this.dragging ? (
          <FloatingChild
            style={{
              height: this.store.childHeight,
              width: this.store.childWidth,
              top: this.store.currentY - this.store.offsetY,
              left: this.store.currentX - this.store.offsetX,
            }}
          >
            {this.props.children}
          </FloatingChild>
        ) : null}
        <ChildWrapper
          className={this.dragging ? 'dragging' : ''}
          innerRef={this.handleChildWrapperRef}
        >{this.props.children}</ChildWrapper>
      </Container>
    );
  }
}
