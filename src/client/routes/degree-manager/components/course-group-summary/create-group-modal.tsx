import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Button, PrimaryButton } from 'components/button';
import { Modal } from 'components/modal';
import { TextField } from 'components/text-field';
import { SelectField } from 'components/select-field';

const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  & > ${Button} {
    margin-left: ${styles.space(-1)};
  }
  margin-top: ${styles.space(0)};
`;
const Spacer = styled.div`
  height: ${styles.space(0)};
  flex: 0 0 auto;
`;

const selectFieldItems = [
  { displayName: 'Column one', value: 1 },
  { displayName: 'Column two', value: 2 },
  { displayName: 'Column three', value: 3 },
];

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, column: number) => void;
}
interface CreateGroupModalState {
  groupName: string;
  column: number;
}

export class CreateGroupModal extends React.PureComponent<
  CreateGroupModalProps,
  CreateGroupModalState
> {
  constructor(props: CreateGroupModalProps) {
    super(props);

    this.state = {
      groupName: '',
      column: 1,
    };
  }

  componentDidUpdate(previousProps: CreateGroupModalProps) {
    const closedBefore = !previousProps.open;
    const openNow = this.props.open;

    if (closedBefore && openNow) {
      this.setState({ groupName: '' });
    }
  }

  handleCreateClick = () => {
    const { groupName, column } = this.state;
    this.props.onCreateGroup(groupName, column);
  };
  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupName = e.currentTarget.value;
    this.setState({ groupName });
  };
  handleColumnChange = (value: number) => {
    this.setState({ column: value });
  };

  render() {
    const { open, onClose } = this.props;
    const { groupName } = this.state;
    return (
      <Modal title="Create new course group..." open={open} onBlurCancel={onClose} size="medium">
        <TextField
          label="Course group name"
          placeholder="e.g. Technical Electives"
          value={groupName}
          onChange={this.handleNameChange}
        />
        <Spacer />
        <SelectField label="Column" items={selectFieldItems} onChange={this.handleColumnChange} />
        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton onClick={this.handleCreateClick}>Create group</PrimaryButton>
        </Actions>
      </Modal>
    );
  }
}
