import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';

const Container = styled(View)`
  flex-shrink: 0;
`;
const HeaderRow = styled(View)`
  flex-direction: row;
`;
const Header = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  margin-right: auto;
`;
const Card = styled(View)`
  padding: ${styles.space(0)};
  background-color: ${styles.white};
  margin-bottom: ${styles.space(1)};
  box-shadow: ${styles.boxShadow(0)};
`;
const CreditHourBlock = styled(View)`
  justify-content: center;
  align-items: center;
  border: 0.1rem solid ${styles.whiteTer};
  padding: ${styles.space(0)};
  margin-right: ${styles.space(0)};
  width: 10rem;
`;
const CreditHourNumber = styled(Text)`
  font-weight: bold;
  font-size: ${styles.space(1)};
`;
const Form = styled.form``;
const Input = styled.input`
  border: none;
  outline: none;
  font-weight: bold;
  font-size: ${styles.space(2)};
  font-family: ${styles.fontFamily};
  width: 10rem;
  text-align: center;
`;

const headingActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
};

export interface MasteredDegreeGroupProps {
  masteredDegreeGroup: Model.MasteredDegreeGroup;
  onDegreeGroupChange: (group: Model.MasteredDegreeGroup) => void;
}

interface MasteredDegreeGroupState {
  editingCreditMinimum: boolean;
  editingCreditMaximum: boolean;
  creditMinimumValue: number;
  creditMaximumValue: number;
}

export class MasteredDegreeGroup extends React.Component<
  MasteredDegreeGroupProps,
  MasteredDegreeGroupState
> {
  constructor(props: MasteredDegreeGroupProps) {
    super(props);
    const { masteredDegreeGroup } = props;
    this.state = {
      editingCreditMinimum: false,
      editingCreditMaximum: false,
      creditMinimumValue: masteredDegreeGroup.creditMinimum,
      creditMaximumValue: masteredDegreeGroup.creditMaximum,
    };
  }

  handleCreditMinimumClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingCreditMinimum: true,
    }));
  };
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  handleAndSelectRef = (e: HTMLInputElement | null | undefined) => {
    if (!e) return;
    e.focus();
    e.select();
  };

  handleHeadingActions = (action: keyof typeof headingActions) => {};

  render() {
    const { masteredDegreeGroup } = this.props;
    return (
      <Container>
        <RightClickMenu
          header={masteredDegreeGroup.name}
          actions={headingActions}
          onAction={this.handleHeadingActions}
        >
          <HeaderRow>
            <Header>{masteredDegreeGroup.name}</Header>
            <DropdownMenu
              header={masteredDegreeGroup.name}
              actions={headingActions}
              onAction={this.handleHeadingActions}
            />
          </HeaderRow>
          <Card>
            <CreditHourBlock>
              {!this.state.editingCreditMinimum ? (
                <CreditHourNumber onClick={this.handleCreditMinimumClick}>
                  {masteredDegreeGroup.creditMinimum}
                </CreditHourNumber>
              ) : (
                <Form onSubmit={this.handleSubmit}>
                  <Input
                    type="number"
                    value={this.state.creditMinimumValue}
                    onChange={this.handleChange}
                    innerRef={this.handleAndSelectRef}
                  />
                </Form>
              )}
              <Text>credits required</Text>
            </CreditHourBlock>
          </Card>
        </RightClickMenu>
      </Container>
    );
  }
}
