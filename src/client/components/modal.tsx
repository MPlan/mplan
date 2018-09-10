import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View, ViewProps } from './view';
import { Text } from './text';
import shallowEqual from 'recompose/shallowEqual';

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
  size?: 'fit' | 'small' | 'medium' | 'large' | 'extra-large';
  minHeight?: number;
}
const Card = styled<CardProps>(View)`
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(1)};
  max-width: calc(100vw - 4rem);
  ${props => (props.minHeight ? `min-height: ${props.minHeight}rem;` : '')};
  ${props => {
    if (props.size === 'small') return 'width: 20rem;';
    if (props.size === 'medium') return 'width: 30rem;';
    if (props.size === 'large') return 'width: 50rem;';
    if (props.size === 'extra-large') return 'width: 70rem;';
    return '';
  }};
  overflow: auto;
`;
const Title = styled(Text)`
  margin-top: ${styles.space(1)};
  padding: 0 ${styles.space(1)};
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  margin-bottom: ${styles.space(-1)};
`;
interface BodyProps extends ViewProps {
  noPadding?: boolean;
}
const Body = styled<BodyProps>(View)`
  ${props => (props.noPadding ? '' : `padding: 0 ${styles.space(1)}`)};
  margin-bottom: ${styles.space(1)};
  flex: 1 1 auto;
`;

export interface ModalProps {
  open: boolean;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  noPadding?: boolean;
  children?: any;
  minHeight?: number;
  onBlurCancel?: () => void;
}

export class Modal extends React.Component<ModalProps, {}> {
  shouldComponentUpdate(nextProps: ModalProps) {
    if (!this.props.open && !nextProps.open) return false;
    if (shallowEqual(this.props, nextProps)) return false;
    return true;
  }

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
          <Card size={this.props.size} minHeight={this.props.minHeight}>
            <Title>{this.props.title}</Title>
            <Body noPadding={this.props.noPadding}>{this.props.children}</Body>
          </Card>
        </Content>
      </Container>
    );
  }
}
