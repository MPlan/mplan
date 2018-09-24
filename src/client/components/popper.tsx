import * as React from 'react';
import * as ReactDom from 'react-dom';
import styled from 'styled-components';

const PopperContainer = styled.div`
  position: fixed;
  z-index: 350;
`;

export interface PopperContainerProps {
  innerRef: React.RefObject<HTMLElement>;
}

interface PopperProps {
  open: boolean;
  onBlurCancel: () => void;
  renderContainer: (props: PopperContainerProps) => React.ReactNode;
  poppedElement: React.ReactNode;
}

interface PopperState {
  left: number | undefined;
  top: number | undefined;
  width: number | undefined;
}

export class Popper extends React.Component<PopperProps, PopperState> {
  overlayElement = document.createElement('div');
  containerRef = React.createRef<HTMLElement>();
  popperContainerProps = {
    innerRef: this.containerRef,
  };

  constructor(props: PopperProps) {
    super(props);
    this.state = {
      left: undefined,
      top: undefined,
      width: undefined,
    };
  }

  componentDidMount() {
    document.body.appendChild(this.overlayElement);
  }
  componentWillUnmount() {
    document.body.removeChild(this.overlayElement);
  }
  componentDidUpdate(previousProps: PopperProps) {
    const closedBefore = !previousProps.open;
    const openNow = this.props.open;

    if (closedBefore && openNow) {
      const { left, top, width } = this.getContainerPosition();
      this.setState({ left, top, width });
    }
  }

  getContainerPosition() {
    const containerElement = this.containerRef.current;
    if (!containerElement) {
      return { left: undefined, top: undefined, width: undefined };
    }

    const { left, top, width, height } = containerElement.getBoundingClientRect();
    return { left, top: top + height, width };
  }

  shouldShowPopper() {
    const { open } = this.props;
    const { left, top, width } = this.state;
    if (!open) return false;
    if (left === undefined) return false;
    if (top === undefined) return false;
    if (width === undefined) return false;
    return true;
  }

  render() {
    const { renderContainer, poppedElement } = this.props;
    const { left, top, width } = this.state;
    const display = this.shouldShowPopper() ? undefined : 'none';

    return (
      <>
        {renderContainer(this.popperContainerProps)}
        {ReactDom.createPortal(
          <PopperContainer style={{ display, left, top, width, height: 0 }}>
            {this.shouldShowPopper() && poppedElement}
          </PopperContainer>,
          this.overlayElement,
        )}
      </>
    );
  }
}
