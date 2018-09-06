import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { MenuItem } from 'components/menu-item';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Card } from 'components/card';
import { DropdownMenu, DropdownMenuProps } from 'components/dropdown-menu';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';

const Root = styled(View)`
  flex: 0 0 auto;
  margin-bottom: ${styles.space(1)};
`;
const TitleRow = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const VerticalBar = styled(View)`
  width: 1px;
  border-right: 1px solid ${styles.grayLighter};
  margin-right: ${styles.space(-1)};
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  margin-right: ${styles.space(-1)};
`;

interface DegreeItemProps<T extends { [key: string]: MenuItem }> {
  title: string;
  dropdownMenuProps?: DropdownMenuProps<T>;
  children: any;
}

export class DegreeItem<T extends { [key: string]: MenuItem }> extends React.PureComponent<
  DegreeItemProps<T>,
  {}
> {
  renderContent = (rightClickProps: RightClickProps | undefined) => {
    const { title, children, dropdownMenuProps } = this.props;

    return (
      <Root {...rightClickProps}>
        <TitleRow>
          <Title>{title}</Title>
          {dropdownMenuProps && (
            <React.Fragment>
              <VerticalBar />
              <DropdownMenu
                header={title}
                actions={dropdownMenuProps.actions}
                onAction={dropdownMenuProps.onAction}
              />
            </React.Fragment>
          )}
        </TitleRow>

        <Card>{children}</Card>
      </Root>
    );
  };
  render() {
    const { title, dropdownMenuProps } = this.props;

    if (dropdownMenuProps) {
      const { actions, onAction } = dropdownMenuProps;
      return (
        <RightClickMenu
          children={this.renderContent}
          header={title}
          actions={actions}
          onAction={onAction}
        />
      );
    }

    return this.renderContent(undefined);
  }
}
