import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Modal } from 'components/modal';
import { View } from 'components/view';
import { DangerButton, Button } from 'components/button';
import { Paragraph } from 'components/paragraph';
import { Fa as _Fa } from 'components/fa';

const Actions = styled(View)`
  flex-direction: row;
  flex: 0 0 auto;
  justify-content: flex-end;

  & > ${Button} {
    margin-left: ${styles.space(0)};
  }
`;
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  title: string;
  confirmationText: string;
  icon?: string;
  info?: string;
}

export class DeleteConfirmationModal extends React.PureComponent<DeleteConfirmationModalProps, {}> {
  render() {
    const { title, confirmationText, open, onClose, onConfirmDelete, icon, info } = this.props;
    return (
      <Modal title={title} open={open} onBlurCancel={onClose} size="medium">
        <Paragraph>{info || 'This action cannot be undone.'}</Paragraph>
        <Actions>
          <Button onClick={onClose}>Cancel</Button>
          <DangerButton onClick={onConfirmDelete}>
            <Fa icon={icon || 'trash'} />
            {confirmationText}
          </DangerButton>
        </Actions>
      </Modal>
    );
  }
}
