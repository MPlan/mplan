import * as React from 'react';
import { Dropdown, DropdownProps, DropdownItem } from './dropdown';
import styled from 'styled-components';
import { View } from './view';

const Container = styled(View)``;

const DropdownContainer = styled(View)``;

interface RightClickMenuProps<T extends { [P in keyof T]: DropdownItem }> {
  actions: T;
  onAction: (action: keyof T) => void;
  children: JSX.Element;
}

export class RightClickMenu<T extends { [P in keyof T]: DropdownItem }> extends React.Component<
  RightClickMenuProps<T>,
  {}
> {
  render() {
    return (
      <Container>
        <DropdownContainer />
        {this.props.children}
      </Container>
    );
  }
}
