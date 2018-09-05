import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { Modal as GenericModal } from 'components/modal';
import { View } from 'components/view';
import { Button } from 'components/button';
import { createScene } from 'utilities/scene';

const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${styles.space(0)};
`;

export function createInfoModal() {
  class InfoModal extends React.Component<
    { title: string; open: boolean; onBlurCancel: () => void; children: any },
    {}
  > {
    render() {
      const { children, title, ...restOfProps } = this.props;
      return (
        <GenericModal {...restOfProps} size="medium" title={title}>
          {children}
          <ButtonRow>
            <Button onClick={this.props.onBlurCancel}>Got it!</Button>
          </ButtonRow>
        </GenericModal>
      );
    }
  }

  const scene = createScene({ open: false });

  const Modal = scene.connect({
    mapSceneToProps: (scene, ownProps: { title: string; children: any }) => ({
      open: scene.open,
      title: `${ownProps.title}`,
      children: ownProps.children,
    }),
    mapSetSceneToProps: setScene => ({
      onBlurCancel: () =>
        setScene(previousScene => ({
          ...previousScene,
          open: false,
        })),
    }),
  })(InfoModal);

  function open() {
    scene.setScene(previousScene => ({
      ...previousScene,
      open: true,
    }));
  }

  return { Modal, open };
}
