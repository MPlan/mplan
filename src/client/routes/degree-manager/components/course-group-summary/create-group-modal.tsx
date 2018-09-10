import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Button, PrimaryButton } from 'components/button';
import { Modal } from 'components/modal';
import { TextField } from 'components/text-field';

const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  & > ${Button} {
    margin-left: ${styles.space(-1)};
  }
`;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, column: 1 | 2 | 3) => void;
}
interface CreateGroupModalState {
  groupName: string;
  column: 1 | 2 | 3;
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

  handleCreateClick = () => {
    const { groupName, column } = this.state;
    this.props.onCreateGroup(groupName, column);
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <Modal title="Create new course group..." open={open} size="medium">
        <TextField label="Course group name" />
        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton onClick={this.handleCreateClick}>Create group</PrimaryButton>
        </Actions>
      </Modal>
    );
  }
}
