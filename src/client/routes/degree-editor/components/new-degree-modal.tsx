import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Modal } from 'components/modal';
import { TextField } from 'components/text-field';
import { PrimaryButton, Button } from 'components/button';

const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${styles.space(0)};
  & > * {
    margin-left: ${styles.space(-1)};
  }
`;

interface NewDegreeModalProps {
  open: boolean;
  onClose: () => void;
  onCreateNewDegree: (degreeName: string) => void;
}
interface NewDegreeModalState {
  degreeName: string;
}

export class NewDegreeModal extends React.PureComponent<NewDegreeModalProps, NewDegreeModalState> {
  constructor(props: NewDegreeModalProps) {
    super(props);

    this.state = {
      degreeName: '',
    };
  }

  handleClickCreate = () => {
    const { onClose, onCreateNewDegree } = this.props;
    onCreateNewDegree(this.state.degreeName);
    onClose();
    this.setState({ degreeName: '' });
  };

  handleDegreeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const degreeName = e.currentTarget.value;
    this.setState({ degreeName });
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <Modal size="medium" title="Create new degree..." open={open} onBlurCancel={onClose}>
        <TextField
          label="Degree Name"
          placeholder="e.g. Software Engineering F17"
          onChange={this.handleDegreeNameChange}
        />
        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton onClick={this.handleClickCreate}>Create New Degree</PrimaryButton>
        </Actions>
      </Modal>
    );
  }
}
