import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import { View } from './view';
import * as uuid from 'uuid/v4';

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
  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(`enter dropzone ${this.dropzoneId}`);
  };

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(`leave dropzone ${this.dropzoneId}`);
  };

  handleContainerRef = (e: HTMLDivElement | null | undefined) => {
    e = this.containerRef;
  }

  render() {
    return (
      <Container
        innerRef={this.handleContainerRef}
        className="dropzone"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}

      >
        {this.props.children}
      </Container>
    );
  }
}
