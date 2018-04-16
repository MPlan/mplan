import * as React from 'react';
import { View, ViewProps } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';

interface ContainerProps extends ViewProps {
  open?: boolean;
}
const Container = styled<ContainerProps>(View)`
  min-width: 100vw;
  width: 100vw;
  min-height: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  ${props => (!props.open ? 'visibility: none;' : '')};
  ${props => (!props.open ? 'z-index: -100;' : 'z-index: 100')};
  align-items: center;
  transition: all 0.2s;
`;
const Content = styled(View)`
  z-index: 160;
  flex-direction: row;
  margin: auto;
`;
const Backdrop = styled(View)`
  background-color: ${styles.black};
  opacity: 0.2;
  z-index: 150;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
`;
interface CardProps extends ViewProps {
  size?: 'fit' | 'small' | 'medium' | 'large';
}
const Card = styled<CardProps>(View)`
  background-color: ${styles.white};
  padding: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(1)};
  ${props => {
    if (props.size === 'small') return 'min-width: 20rem;';
    if (props.size === 'medium') return 'min-width: 30rem;';
    if (props.size === 'large') return 'min-width: 50rem;';
    return '';
  }};
  overflow: auto;
`;
const Title = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  margin-bottom: ${styles.space(-1)};
`;
const Body = styled(View)``;

interface ModalProps {
  open: boolean;
  title: string;
  size?: 'small' | 'medium' | 'large';
  children?: any;
  onBlurCancel?: () => void;
}

export class Modal extends React.Component<ModalProps, {}> {
  handleKeydown = (e: KeyboardEvent) => {
    if (!this.props.open) return;
    if (e.key === 'Escape') {
      this.props.onBlurCancel && this.props.onBlurCancel();
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  render() {
    return (
      <Container open={this.props.open} style={{ opacity: this.props.open ? 1 : 0 }}>
        <Backdrop onClick={this.props.onBlurCancel} />
        <Content>
          <Card size={this.props.size}>
            <Title>{this.props.title}</Title>
            <Body>{this.props.children}</Body>
          </Card>
        </Content>
      </Container>
    );
  }
}
