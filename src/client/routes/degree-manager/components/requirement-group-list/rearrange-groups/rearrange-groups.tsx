import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Modal } from 'components/modal';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { SortableGroupList } from './sortable-group-list';
import { SortEnd } from 'react-sortable-hoc';

const Columns = styled(View)`
  flex-direction: row;
`;
const Column = styled(View)`
  flex: 1 1 calc(33% - ${styles.space(-1)});
  margin-right: ${styles.space(-1)};
`;
const ColumnTitle = styled(Text)`
  margin: 0 ${styles.space(-1)};
  margin-bottom: ${styles.space(0)};
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;

export interface GroupViewModel {
  id: string;
  name: string;
  column: number;
}

interface RearrangeGroupsProps {
  groupsColumnOne: GroupViewModel[];
  groupsColumnTwo: GroupViewModel[];
  groupsColumnThree: GroupViewModel[];
  open: boolean;
  onClose: () => void;
  onRearrange: (fromColumn: number, toColumn: number, oldIndex: number, newIndex: number) => void;
}

export class RearrangeGroups extends React.PureComponent<RearrangeGroupsProps, {}> {
  handleOnLeftColumnOne = () => {};
  handleOnRightColumnOne = (groupId: string) => {
    const { groupsColumnOne, groupsColumnTwo, onRearrange } = this.props;
    const fromColumn = 1;
    const toColumn = 2;
    const oldIndex = groupsColumnOne.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, groupsColumnTwo.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnLeftColumnTwo = (groupId: string) => {
    const { groupsColumnOne, groupsColumnTwo, onRearrange } = this.props;
    const fromColumn = 2;
    const toColumn = 1;
    const oldIndex = groupsColumnTwo.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, groupsColumnOne.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnRightColumnTwo = (groupId: string) => {
    const { groupsColumnTwo, groupsColumnThree, onRearrange } = this.props;
    const fromColumn = 2;
    const toColumn = 3;
    const oldIndex = groupsColumnTwo.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, groupsColumnThree.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnLeftColumnThree = (groupId: string) => {
    const { groupsColumnTwo, groupsColumnThree, onRearrange } = this.props;
    const fromColumn = 3;
    const toColumn = 2;
    const oldIndex = groupsColumnThree.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, groupsColumnTwo.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnRightColumnThree = () => {};

  handleSortEndColumnOne = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(1, 1, oldIndex, newIndex);
  };
  handleSortEndColumnTwo = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(2, 2, oldIndex, newIndex);
  };
  handleSortEndColumnThree = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(3, 3, oldIndex, newIndex);
  };

  render() {
    const {
      open,
      onClose,
      groupsColumnOne,
      groupsColumnTwo,
      groupsColumnThree,
    } = this.props;

    return (
      <Modal title="Rearranging groups…" open={open} onBlurCancel={onClose} size="large">
        <Columns>
          <Column>
            <ColumnTitle>Column One</ColumnTitle>
            <SortableGroupList
              distance={5}
              lockAxis="y"
              groups={groupsColumnOne}
              onLeft={this.handleOnLeftColumnOne}
              onRight={this.handleOnRightColumnOne}
              onSortEnd={this.handleSortEndColumnOne}
              helperClass="sortableHelper"
            />
          </Column>
          <Column>
            <ColumnTitle>Column Two</ColumnTitle>
            <SortableGroupList
              distance={5}
              lockAxis="y"
              groups={groupsColumnTwo}
              onLeft={this.handleOnLeftColumnTwo}
              onRight={this.handleOnRightColumnTwo}
              onSortEnd={this.handleSortEndColumnTwo}
              helperClass="sortableHelper"
            />
          </Column>
          <Column>
            <ColumnTitle>Column Three</ColumnTitle>
            <SortableGroupList
              distance={5}
              lockAxis="y"
              groups={groupsColumnThree}
              onLeft={this.handleOnLeftColumnThree}
              onRight={this.handleOnRightColumnThree}
              onSortEnd={this.handleSortEndColumnThree}
              helperClass="sortableHelper"
            />
          </Column>
        </Columns>
        <Actions>
          <Button onClick={onClose}>Done</Button>
        </Actions>
      </Modal>
    );
  }
}
