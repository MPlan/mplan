import * as React from 'react';
import { Dropdown } from './dropdown';
import { MenuItem } from './menu-item';
import styled from 'styled-components';
import { View } from './view';

const Container = styled(View)`
  position: relative;
  flex: 1;
`;

const DropdownContainer = styled(View)`
  position: relative;
  width: 12rem;
`;

export interface RightClickMenuProps<T extends { [P in keyof T]: MenuItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  header: string;
  children: any;
}

const initialState = {
  open: false,
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
};

function moved(point0: { y: number; x: number }, point1: { y: number; x: number }) {
  if (point0.y !== point1.y) return true;
  if (point0.x !== point1.x) return true;
  return false;
}

function findClosestRightClickParent(
  element: HTMLElement | undefined | null,
): HTMLElement | undefined | null {
  if (!element) return element;
  if (element.classList.contains('right-click-menu')) return element;
  return findClosestRightClickParent(element.parentElement);
}

type InitialState = typeof initialState;
export interface RightClickMenuState extends InitialState {}

export class RightClickMenu<T extends { [P in keyof T]: MenuItem }> extends React.Component<
  RightClickMenuProps<T>,
  RightClickMenuState
> {
  containerRef = React.createRef<HTMLElement>();

  constructor(props: RightClickMenuProps<T>) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('contextmenu', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('contextmenu', this.handleClick);
  }

  nestedRightClickMenuCount() {
    const containerRef = this.containerRef.current;
    if (!containerRef) return Number.POSITIVE_INFINITY;
    return containerRef.querySelectorAll('.right-click-menu').length;
  }

  handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const containerRect = e.currentTarget.getBoundingClientRect();

    const closestRightClickParent = findClosestRightClickParent(e.target as HTMLElement);
    if (closestRightClickParent !== this.containerRef.current) {
      this.setState(previousState => ({
        ...previousState,
        open: false,
      }));
      return;
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    const y = clientY - containerRect.top;
    const x = clientX - containerRect.left;

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

  handleClick = (e: MouseEvent) => {
    const containerRef = this.containerRef.current;
    if (!containerRef) {
      this.closeMenu();
      return;
    }
    const eventTarget = e.target as HTMLElement | null | undefined;
    if (!eventTarget) {
      this.closeMenu();
      return;
    }
    if (containerRef.contains(eventTarget)) {
      if (e.button !== 2) {
        this.closeMenu();
        return;
      }
      return;
    }
    this.closeMenu();
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

  render() {
    return (
      <Container
        className="right-click-menu"
        onContextMenu={this.handleContextMenu}
        innerRef={this.containerRef}
      >
        <DropdownContainer style={{ top: this.state.y, left: this.state.x }}>
          <Dropdown
            header={this.props.header}
            actions={this.props.actions}
            onAction={this.props.onAction}
            open={this.state.open}
            onBlur={this.handleDropdownBlur}
          />
        </DropdownContainer>
        {this.props.children}
      </Container>
    );
  }
}
