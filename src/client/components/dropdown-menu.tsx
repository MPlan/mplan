import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { Dropdown } from 'components/dropdown';
import { MenuItem } from 'components/menu-item';
import { IconButton } from 'components/icon-button';
import { ClickAwayListener } from 'components/click-away-listener';

const Container = styled(View)`
  position: relative;
  color: ${styles.text};
  & ${Text} {
    color: ${styles.text};
  }
`;

export type Actions<T extends string> = { [P in T]: MenuItem };

export interface DropdownMenuProps<T extends { [P in keyof T]: MenuItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  header: string;
}

interface DropdownMenuState<T extends { [P in keyof T]: MenuItem }> {
  open: boolean;
}

export class DropdownMenu<T extends { [P in keyof T]: MenuItem }> extends React.PureComponent<
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
    const { actions, onAction, header, children, ...restOfProps } = this.props;
    return (
      <Container {...restOfProps}>
        <IconButton onClick={this.handleEllipsisClick} onBlur={this.handleEllipsisBlur}>
          <Fa icon="ellipsisH" size="lg" />
        </IconButton>
        <ClickAwayListener onClickAway={this.handleDropdownBlur}>
          <Dropdown
            header={header}
            ref={this.dropdownRef}
            open={this.state.open}
            onBlur={this.handleDropdownBlur}
            actions={actions}
            onAction={onAction}
          />
        </ClickAwayListener>
      </Container>
    );
  }
}
