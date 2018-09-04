import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { Fa } from 'components/fa';

const Root = styled(View)`
  position: absolute;
  right: ${styles.space(1)};
  top: 0;
  box-shadow: ${styles.boxShadow(-1)};
  padding: ${styles.space(0)} 0;
  background-color: ${styles.white};
  width: 15rem;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 ${styles.space(0)};
`;
const ButtonFa = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const Actions = styled(View)`
  transition: all 200ms;
  overflow: hidden;
`;
const Action = styled(View)`
  &:hover,
  &:focus {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
  height: 3rem;
  padding: 0 ${styles.space(0)};
  justify-content: center;
  transition: all 200ms;
`;

interface ActionMenuProps {}
interface ActionMenuState {
  open: boolean;
}

export class ActionMenu extends React.PureComponent<ActionMenuProps, ActionMenuState> {
  constructor(props: ActionMenuProps) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleToggleOpen = () => {
    this.setState(previousState => ({ open: !previousState.open }));
  };

  render() {
    const { open } = this.state;
    return (
      <Root>
        <Actions
          style={{
            height: open ? `${2 * 3 + 1}rem` : 0,
            opacity: open ? 1 : 0,
          }}
        >
          <Action>
            <Text>+ Do something</Text>
          </Action>
          <Action>
            <Text>+ Do something else</Text>
          </Action>
        </Actions>
        <ButtonRow>
          <PrimaryButton onClick={this.handleToggleOpen}>
            {open ? <ButtonFa icon="angleUp" /> : <ButtonFa icon="angleDown" />}
            {open ? 'Done' : 'Actions Menu'}
          </PrimaryButton>
        </ButtonRow>
      </Root>
    );
  }
}
