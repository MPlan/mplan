import * as React from 'react';
import { Dropdown, DropdownProps, DropdownItem } from './dropdown';
import styled from 'styled-components';
import { View } from './view';
import { wait } from '../../utilities/utilities';

const Container = styled(View)`
  position: relative;
`;

const DropdownContainer = styled(View)`
  position: relative;
  width: 12rem;
`;

export interface RightClickMenuProps<T extends { [P in keyof T]: DropdownItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  children: JSX.Element;
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

type InitialState = typeof initialState;
export interface RightClickMenuState extends InitialState {}

export class RightClickMenu<T extends { [P in keyof T]: DropdownItem }> extends React.Component<
  RightClickMenuProps<T>,
  RightClickMenuState
> {
  containerRef: HTMLDivElement | null | undefined;

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

  handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const containerRect = e.currentTarget.getBoundingClientRect();

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
    const containerRef = this.containerRef;
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

  handleContainerRef = (e: HTMLDivElement | null | undefined) => {
    this.containerRef = e;
  };

  render() {
    return (
      <Container onContextMenu={this.handleContextMenu} innerRef={this.handleContainerRef}>
        <DropdownContainer style={{ top: this.state.y, left: this.state.x }}>
          <Dropdown
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
