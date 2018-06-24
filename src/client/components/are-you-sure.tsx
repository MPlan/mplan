import * as React from 'react';
import { Modal } from 'components/modal';
import { createScene } from 'utilities/scene';
import { View } from 'components/view';
import { Paragraph } from 'components/paragraph';
import { Button, DangerButton } from 'components/button';
import { Fa } from 'components/fa';
import styled from 'styled-components';
import * as styles from 'styles';

const ButtonIcon = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${styles.space(0)};
`;
const ConfirmButton = styled(DangerButton)`
  margin-left: ${styles.space(-1)};
`;

interface AreYouSureState {
  open: boolean;
}

interface ActionButtonProps {
  onClick: () => void;
}
class ActionButton extends React.PureComponent<ActionButtonProps, {}> {
  render() {
    return <Button onClick={this.props.onClick}>{this.props.children}</Button>;
  }
}

interface AreYouSureModalProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmText: React.ReactNode;
  cancelText: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

class AreYouSureModal extends React.PureComponent<AreYouSureModalProps, {}> {
  render() {
    return (
      <Modal size="medium" title={this.props.title} open={this.props.open}>
        <Paragraph>{this.props.description}</Paragraph>
        <ButtonRow>
          <Button onClick={this.props.onCancel}>
            <ButtonIcon icon="times" />
            {this.props.cancelText}
          </Button>
          <ConfirmButton onClick={this.props.onConfirm}>
            <ButtonIcon icon="trash" />
            {this.props.confirmText}
          </ConfirmButton>
        </ButtonRow>
      </Modal>
    );
  }
}

export function createAreYouSure() {
  const scene = createScene({ open: false });

  const ConnectedButton = scene.connect({
    mapSceneToProps: (scene: AreYouSureState, ownProps: { children?: any }) => {
      return { ...ownProps };
    },
    mapSetSceneToProps: setScene => {
      return {
        onClick: () =>
          setScene(previousScene => ({
            ...previousScene,
            open: true,
          })),
      };
    },
  })(ActionButton);

  interface ConnectedModalProps {
    title: string;
    confirmText: React.ReactNode;
    cancelText: React.ReactNode;
    description: React.ReactNode;
    onConfirm: () => void;
  }

  const ConnectedModal = scene.connect({
    mapSceneToProps: (scene, ownProps: ConnectedModalProps) => {
      return {
        open: scene.open,
        title: ownProps.title,
        description: ownProps.description,
        confirmText: ownProps.confirmText,
        cancelText: ownProps.cancelText,
      };
    },
    mapSetSceneToProps: (setScene, ownProps: ConnectedModalProps) => {
      const close = (previousScene: AreYouSureState) => ({
        ...previousScene,
        open: false,
      });

      return {
        onCancel: () => {
          setScene(close);
        },
        onConfirm: () => {
          ownProps.onConfirm();
          setScene(close);
        },
      };
    },
  })(AreYouSureModal);

  return { Button: ConnectedButton, Modal: ConnectedModal };
}
