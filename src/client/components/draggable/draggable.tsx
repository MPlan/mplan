import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import * as uuid from 'uuid/v4';
import * as styles from 'styles';

const Container = styled(View)`
  position: relative;
  flex-shrink: 0;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;
const ChildWrapperContainer = styled.div`
  transition: all 200ms;
  max-height: 20rem;
  &.dragging {
    max-height: 0;
    opacity: 0;
  }
`;
class ChildWrapper extends React.Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    innerRef: any;
    dragging: boolean;
  },
  { mounted: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { mounted: false };
  }
  componentDidMount() {
    this.setState(previousState => ({
      ...previousState,
      mounted: true,
    }));
  }

  render() {
    const { ref, className, ...restOfProps } = this.props;
    return (
      <ChildWrapperContainer
        className={
          (className || '') + /*if*/ (!this.props.dragging && this.state.mounted ? '' : ' dragging')
        }
        {...restOfProps}
      />
    );
  }
}
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
  transition: all 200ms;
`;

export interface DraggableProps {
  id: string;
  elementIndex: number;
  dropzoneActive: boolean;
  children?: JSX.Element;
  dragging: boolean;
  selectedDraggableId: string;
  closestElementId: string;
  height: number;
  onDragStart: (
    params: {
      selectedDraggableId: string;
      selectedElementId: string;
      height: number;
    },
  ) => void;
  onDragEnd: () => void;
}

export interface DraggableState {
  childMounted: boolean;
}

export class Draggable extends React.Component<DraggableProps, DraggableState> {
  draggableId = uuid();
  childWrapperRef = React.createRef<HTMLElement>();
  containerRef = React.createRef<HTMLElement>();

  constructor(props: DraggableProps) {
    super(props);
    this.state = {
      childMounted: false,
    };
  }

  get draggingCurrent() {
    return this.props.dragging && this.props.selectedDraggableId === this.draggableId;
  }

  get spacer() {
    if (!this.props.dropzoneActive) return false;
    if (!this.props.dragging) return false;
    if (this.props.closestElementId !== this.props.id) return false;
    return true;
  }

  handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text', this.draggableId);
    e.dataTransfer.effectAllowed = 'copyMove';
    const childWrapperRef = this.childWrapperRef.current;
    const childHeight = childWrapperRef && childWrapperRef.getBoundingClientRect().height;

    this.props.onDragStart({
      selectedDraggableId: this.draggableId,
      selectedElementId: this.props.id,
      height: childHeight || 0,
    });
  };

  getChildBoundingRect() {
    if (!this.childWrapperRef.current) return undefined;
    return this.childWrapperRef.current.getBoundingClientRect();
  }

  getContainerBoundingRect() {
    if (!this.containerRef.current) return undefined;
    return this.containerRef.current.getBoundingClientRect();
  }

  render() {
    return (
      <Container
        className={['draggable', `draggable-${this.draggableId}`].join(' ')}
        innerRef={this.containerRef}
      >
        <ChildWrapper
          draggable
          dragging={this.draggingCurrent}
          className={[
            'drag',
            `drag-id-${this.props.id}`,
            this.props.dragging ? 'drag-mode' : '',
          ].join(' ')}
          innerRef={this.childWrapperRef}
          onDragStart={this.handleDragStart}
          onDragEnd={this.props.onDragEnd}
        >
          {this.props.children}
        </ChildWrapper>
        <Spacer style={{ height: this.spacer ? this.props.height : 0 }}>Incoming!</Spacer>
      </Container>
    );
  }
}
