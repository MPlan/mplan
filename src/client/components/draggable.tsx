import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import * as uuid from 'uuid/v4';

const Container = styled(View)``;

const FloatingChild = styled.div`
  position: absolute;
`;
const ChildWrapper = styled.div``;

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
    const y = e.clientY;
    const x = e.clientX;
    const childBoundingRect = this.getChildBoundingRect();
    this.setStore(store =>
      store
        .set('mouseDown', true)
        .set('selectedDraggableId', this.draggableId)
        .set('startY', y)
        .set('startX', x)
        .set('currentY', y)
        .set('currentX', x)
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

  getChildBoundingRect() {
    if (!this.childWrapperRef) return undefined;
    return this.childWrapperRef.getBoundingClientRect();
  }

  render() {
    return (
      <Container onMouseDown={this.handleMouseDown}>
        {this.dragging ? (
          <FloatingChild
            style={{
              height: this.store.childHeight,
              width: this.store.childWidth,
            }}
          >
            {this.props.children}
          </FloatingChild>
        ) : (
          <ChildWrapper innerRef={this.handleChildWrapperRef}>{this.props.children}</ChildWrapper>
        )}
      </Container>
    );
  }
}
