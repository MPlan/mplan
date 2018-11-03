import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Modal } from 'components/modal';
import { Button, PrimaryButton } from 'components/button';
import { View } from 'components/view';
import { TextField } from 'components/text-field';
import { SelectField } from 'components/select-field';

const Content = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  & > :not(:last-child) {
    margin-right: ${styles.space(-1)};
  }
`;

const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-left: ${styles.space(-1)};
  margin-top: ${styles.space(-1)};
  & > * {
    margin-left: ${styles.space(-1)};
  }
`;

interface NewDegreeModalProps {
  open: boolean;
  existingDegrees: Array<{ name: string; id: string }>;
  onClose: () => void;
  onCreateDegreeFromExisting: (id: string) => void;
  onCreateNewDegree: (name: string) => void;
}

interface NewDegreeModalState {
  fromExistingOpen: boolean;
  newDegreeOpen: boolean;
  existingDegreeId: string | undefined;
  newDegreeName: string;
}

export class NewDegreeModal extends React.Component<NewDegreeModalProps, NewDegreeModalState> {
  constructor(props: NewDegreeModalProps) {
    super(props);

    this.state = {
      fromExistingOpen: false,
      newDegreeOpen: false,
      existingDegreeId: props.existingDegrees[0] && props.existingDegrees[0].id,
      newDegreeName: '',
    };
  }

  handleFromExistingOpen = () => {
    this.setState({ fromExistingOpen: true });
  };
  handleFromExistingClose = () => {
    this.setState({ fromExistingOpen: false });
  };

  handleNewDegreeOpen = () => {
    this.setState({ newDegreeOpen: true });
  };
  handleNewDegreeClose = () => {
    this.setState({ newDegreeOpen: false });
  };

  handleExistingDegreeChange = (degreeId: string) => {
    this.setState({ existingDegreeId: degreeId });
  };
  handleCreateDegreeFromExisting = () => {
    const { existingDegreeId } = this.state;
    const { onCreateDegreeFromExisting, onClose } = this.props;
    if (!existingDegreeId) return;

    onCreateDegreeFromExisting(existingDegreeId);
    this.handleFromExistingClose();
    onClose();
  };

  handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDegreeName = e.currentTarget.value;
    this.setState({ newDegreeName });
  };
  handleCreateCompletelyNew = () => {
    const { newDegreeName } = this.state;
    const { onCreateNewDegree, onClose } = this.props;

    if (!newDegreeName) return;

    onCreateNewDegree(newDegreeName);
    this.handleNewDegreeClose();
    onClose();
  };

  render() {
    const { open, onClose, existingDegrees } = this.props;
    const { fromExistingOpen, newDegreeOpen } = this.state;

    return (
      <>
        <Modal title="Create degree…" size="medium" open={open} onBlurCancel={onClose}>
          <Content>
            <Button onClick={onClose}>Cancel</Button>
            <PrimaryButton onClick={this.handleFromExistingOpen}>
              From existing degree
            </PrimaryButton>
            <PrimaryButton onClick={this.handleNewDegreeOpen}>Completely New degree</PrimaryButton>
          </Content>
        </Modal>
        <Modal
          title="Create degree from existing…"
          open={fromExistingOpen}
          onBlurCancel={this.handleFromExistingClose}
        >
          <SelectField
            label="Select degree to duplicate:"
            items={existingDegrees.map(degree => ({ displayName: degree.name, value: degree.id }))}
            onChange={this.handleExistingDegreeChange}
          />
          <Actions>
            <Button onClick={this.handleFromExistingClose}>Cancel</Button>
            <PrimaryButton onClick={this.handleCreateDegreeFromExisting}>Duplicate</PrimaryButton>
          </Actions>
        </Modal>
        <Modal title="Create completely new degree…" open={newDegreeOpen}>
          <TextField
            label="Degree Name"
            placeholder="e.g. Software Engineering 2018"
            onChange={this.handleNewChange}
          />
          <Actions>
            <Button onClick={this.handleNewDegreeClose}>Cancel</Button>
            <PrimaryButton onClick={this.handleCreateCompletelyNew}>Create New</PrimaryButton>
          </Actions>
        </Modal>
      </>
    );
  }
}
