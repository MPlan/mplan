import * as React from 'react';
import * as ReactDom from 'react-dom';
import styled from 'styled-components';

import { View } from './view';
import { Dropdown } from './dropdown';
import { MenuItem } from './menu-item';
import { ClickAwayListener } from './click-away-listener';

const rightClickMenuClassName = 'right-click-menu';

export interface RightClickProps {
  className: string;
  onContextMenu: (e: React.MouseEvent<any>) => void;
  innerRef: React.RefObject<HTMLElement>;
}

function moved(point0: { y: number; x: number }, point1: { y: number; x: number }) {
  if (point0.y !== point1.y) return true;
  if (point0.x !== point1.x) return true;
  return false;
}

function findClosestRightClickParent(
  element: HTMLElement | undefined | null,
  containerElement: HTMLElement,
): HTMLElement | undefined | null {
  if (!element) return element;
  if (element.classList.contains(rightClickMenuClassName)) return element;
  return findClosestRightClickParent(element.parentElement, containerElement);
}

const Container = styled(View)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 11;
`;
const Backdrop = styled(View)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.1;
`;
const DropdownContainer = styled(View)`
  position: absolute;
  width: 12rem;
`;

export interface RightClickMenuProps<T extends { [P in keyof T]: MenuItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  header: string;
  render: (props: RightClickProps) => JSX.Element;
}

interface RightClickMenuState {
  open: boolean;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
}

export class RightClickMenu<T extends { [P in keyof T]: MenuItem }> extends React.Component<
  RightClickMenuProps<T>,
  RightClickMenuState
> {
  overlayElement = document.createElement('div');
  containerRef = React.createRef<HTMLElement>();

  constructor(props: RightClickMenuProps<T>) {
    super(props);

    this.state = {
      open: false,
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    };
  }

  componentDidMount() {
    // document.addEventListener('contextmenu', this.handleClick);
    document.body.appendChild(this.overlayElement);
  }

  componentWillUnmount() {
    // document.removeEventListener('contextmenu', this.handleClick);
    document.body.removeChild(this.overlayElement);
  }

  handleContextMenu = async (e: React.MouseEvent<HTMLElement>) => {
    console.log('context menu');
    const container = this.containerRef.current;
    if (!container) return;

    e.preventDefault();
    const closestRightClickParent = findClosestRightClickParent(e.target as HTMLElement, container);
    if (closestRightClickParent !== this.containerRef.current) {
      this.setState(previousState => ({
        ...previousState,
        open: false,
      }));
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    this.setState(previousState => {
      const newPoint = { y, x };
      if (moved(previousState, newPoint)) {
        return {
          ...previousState,
          open: true,
          y,
          x,
          lastY: previousState.y,
          lastX: previousState.x,
        };
      }
      return {
        ...previousState,
        open: !previousState.open,
        y,
        x,
        lastY: y,
        lastX: x,
      };
    });
  };

  closeMenu() {
    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  }

  handleDropdownBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  };

  rightClickProps = {
    className: rightClickMenuClassName,
    onContextMenu: this.handleContextMenu,
    innerRef: this.containerRef,
  };

  render() {
    return (
      <React.Fragment>
        {ReactDom.createPortal(
          <Container
            onContextMenu={this.handleDropdownBlur}
            style={{ display: this.state.open ? 'block' : 'none' }}
          >
            <ClickAwayListener onClickAway={this.handleDropdownBlur}>
              <DropdownContainer style={{ top: this.state.y, left: this.state.x }}>
                <Dropdown
                  header={this.props.header}
                  actions={this.props.actions}
                  onAction={this.props.onAction}
                  open={this.state.open}
                  onBlur={this.handleDropdownBlur}
                />
              </DropdownContainer>
            </ClickAwayListener>
            <Backdrop />
          </Container>,
          this.overlayElement,
        )}
        {this.props.render(this.rightClickProps)}
      </React.Fragment>
    );
  }
}
