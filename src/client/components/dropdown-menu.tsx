import * as React from 'react';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import { Fa } from './fa';
import * as styles from '../styles';
import { wait } from '../../utilities/utilities';
import { Dropdown, DropdownProps } from './dropdown';
import { MenuItem } from './menu-item';

const Container = styled(View)`
  position: relative;
  color: ${styles.text};
  & ${Text} {
    color: ${styles.text};
  }
`;
const EllipsisButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${styles.space(1)};
  height: ${styles.space(1)};
  border-radius: 99999px;
  outline: none;
  border: none;
  margin-top: 0.2rem;
  background-color: transparent;
  cursor: pointer;
  &:hover,
  &:focus {
    color: ${styles.blue};
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  transition: all 0.2;
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(0)};
`;

export interface DropdownMenuProps<T extends { [P in keyof T]: MenuItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  header: string;
}

interface DropdownMenuState<T extends { [P in keyof T]: MenuItem }> {
  open: boolean;
}

export class DropdownMenu<T extends { [P in keyof T]: MenuItem }> extends React.Component<
  DropdownMenuProps<T>,
  DropdownMenuState<T>
> {
  dropdownRef = React.createRef<Dropdown<T>>();

  constructor(props: DropdownMenuProps<T>) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleDropdownBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  };

  handleEllipsisClick = () => {
    this.setState(previousState => ({
      ...previousState,
      open: !previousState.open,
    }));
  };

  handleEllipsisBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget) {
      this.setState(previousState => ({
        ...previousState,
        open: false,
      }));
      return;
    }

    const dropdownRef = this.dropdownRef.current;
    if (!dropdownRef) return;
    const dropdownContainerElement = dropdownRef.containerRef.current;

    if (!dropdownContainerElement) return;
    if (dropdownContainerElement.contains(relatedTarget)) return;

    this.setState(previousState => ({
      ...previousState,
      open: false,
    }));
  };

  render() {
    return (
      <Container>
        <EllipsisButton onClick={this.handleEllipsisClick} onBlur={this.handleEllipsisBlur}>
          <Fa icon="ellipsisH" size="lg" />
        </EllipsisButton>
        <Dropdown
          header={this.props.header}
          ref={this.dropdownRef}
          open={this.state.open}
          onBlur={this.handleDropdownBlur}
          actions={this.props.actions}
          onAction={this.props.onAction}
        />
      </Container>
    );
  }
}
