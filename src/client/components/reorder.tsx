import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { SortableContainer, SortableElement, SortEndHandler } from 'react-sortable-hoc';
import './reorder-styles';
import { Modal } from 'components/modal';
import { Button } from 'components/button';

const ListContainer = styled(View)`
  margin-bottom: ${styles.space(0)};
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;
const ItemWrapper = styled(View)`
  &:hover {
    box-shadow: ${styles.grabbableShadow};
    z-index: 100;
  }
  margin: 0 -${styles.space(1)};
  background-color: white;
  cursor: grab;
`;

function List(props: { children: JSX.Element[] }) {
  return <ListContainer>{props.children}</ListContainer>;
}

export interface ReorderProps<T> {
  title: string;
  open: boolean;
  onClose: () => void;
  elements: T[];
  render: (t: T) => JSX.Element;
  onReorder: SortEndHandler;
}

export class Reorder<T> extends React.PureComponent<ReorderProps<T>> {
  sortableItem = SortableElement((props: { value: T }) => {
    return <ItemWrapper>{this.props.render(props.value)}</ItemWrapper>;
  });

  sortableList = SortableContainer((props: { elements: T[] }) => {
    const SortableItem = this.sortableItem;
    return (
      <List>
        {props.elements.map((element, index) => (
          <SortableItem key={index} index={index} value={element} />
        ))}
      </List>
    );
  });

  render() {
    const SortableList = this.sortableList;
    return (
      <Modal
        size="small"
        title={this.props.title}
        open={this.props.open}
        onBlurCancel={this.props.onClose}
      >
        <SortableList
          helperClass="sortable-helper"
          onSortEnd={this.props.onReorder}
          elements={this.props.elements}
          lockAxis="y"
        />
        <ButtonRow>
          <Button onClick={this.props.onClose}>Done</Button>
        </ButtonRow>
      </Modal>
    );
  }
}
