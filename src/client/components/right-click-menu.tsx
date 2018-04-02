import * as React from 'react';
import { Dropdown, DropdownProps, DropdownItem } from './dropdown';
import styled from 'styled-components';
import { View } from './view';
import { wait } from '../../utilities/utilities';
import * as Model from '../models';
import * as uuid from 'uuid/v4';

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

function moved(point0: { y: number; x: number }, point1: { y: number; x: number }) {
  if (point0.y !== point1.y) return true;
  if (point0.x !== point1.x) return true;
  return false;
}

export const RightClickMenu = (function BaseClass<T extends { [P in keyof T]: DropdownItem }>() {
  const BaseClass = Model.store.connect({
    scope: store => store.contextMenu,
    descope: (store: Model.App, contextMenu: Model.ContextMenu) =>
      store.set('contextMenu', contextMenu),
    propsExample: (undefined as any) as RightClickMenuProps<T>,
  });

  return class RightClickMenu extends BaseClass {
    containerRef: HTMLDivElement | null | undefined;
    menuId = uuid();

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

      this.setStore(store => {
        const newPoint = { y, x };
        if (moved(store, newPoint)) {
          return store
            .set('currentMenuId', this.menuId)
            .set('y', y)
            .set('x', x)
            .set('lastY', store.y)
            .set('lastX', store.x);
        }

        return store
          .set('currentMenuId', /*if*/ !!store.currentMenuId ? undefined : store.currentMenuId)
          .set('y', y)
          .set('x', x)
          .set('lastY', y)
          .set('lastX', x);
      });
    };

    handleClick = (e: MouseEvent) => {
      const containerRef = this.containerRef;
      if (!containerRef) {
        this.handleDropdownBlur();
        return;
      }
      const eventTarget = e.target as HTMLElement | null | undefined;
      if (!eventTarget) {
        this.handleDropdownBlur();
        return;
      }
      if (containerRef.contains(eventTarget)) {
        if (e.button !== 2) {
          this.handleDropdownBlur();
          return;
        }
        return;
      }
      this.handleDropdownBlur();
    };

    handleDropdownBlur = () => {
      this.setStore(store => store.set('currentMenuId', undefined))
    }

    handleContainerRef = (e: HTMLDivElement | null | undefined) => {
      this.containerRef = e;
    };

    render() {
      return (
        <Container onContextMenu={this.handleContextMenu} innerRef={this.handleContainerRef}>
          <DropdownContainer style={{ top: this.store.y, left: this.store.x }}>
            <Dropdown
              actions={this.props.actions}
              onAction={this.props.onAction}
              open={this.store.open}
              onBlur={this.handleDropdownBlur}
            />
          </DropdownContainer>
          {this.props.children}
        </Container>
      );
    }
  };
})();
