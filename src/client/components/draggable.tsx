import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import * as uuid from 'uuid/v4';
import * as styles from '../styles';
import { wait } from '../../utilities/utilities';

const Container = styled(View)`
  position: relative;
  flex-shrink: 0;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;
const FloatingChild = styled.div`
  position: absolute;
  z-index: 200;
  box-shadow: 0 0.4rem 1.3rem 0 rgba(12, 0, 51, 0.2);
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
}

export class Draggable extends Model.store.connect({
  scope: store => store.ui.draggables,
  descope: (store: Model.App, draggables: Model.Draggables) =>
    store.updateUi(ui => ui.set('draggables', draggables)),
  propsExample: (undefined as any) as DraggableProps,
  initialState: {
    childMounted: false,
  },
}) {
  draggableId = uuid();
  childWrapperRef = React.createRef<HTMLElement>();
  containerRef = React.createRef<HTMLElement>();

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
    e.dataTransfer.effectAllowed = 'copyMove';
    const childWrapperRef = this.childWrapperRef.current;
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
    this.setStore(store => store.set('dragging', false));
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
            this.store.dragging ? 'drag-mode' : '',
          ].join(' ')}
          innerRef={this.childWrapperRef}
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
