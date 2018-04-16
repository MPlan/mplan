import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';
import { Button } from './button';
import { Fa } from './fa';

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
  margin-right: ${styles.space(0)};
  width: 16rem;
  padding-top: ${styles.space(0)};
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
  font-size: ${styles.space(1)};
  font-family: ${styles.fontFamily};
  width: 10rem;
  text-align: center;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  width: 100%;
  & > * {
    flex: 1;
  }
`;
const CreditsLabel = styled(Text)`
  flex: 1;
  margin-bottom: ${styles.space(0)};
`;
const Row = styled(View)`
  flex-direction: row;
`;

const headingActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
};

export interface MasteredDegreeGroupProps {
  masteredDegreeGroup: Model.MasteredDegreeGroup;
  onDegreeGroupUpdate: (
    update: (group: Model.MasteredDegreeGroup) => Model.MasteredDegreeGroup,
  ) => void;
}

interface MasteredDegreeGroupState {
  editingCreditMinimum: boolean;
  editingCreditMaximum: boolean;
  creditMinimumValue: string;
  creditMaximumValue: string;
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
      creditMinimumValue: masteredDegreeGroup.creditMinimum.toString(),
      creditMaximumValue: masteredDegreeGroup.creditMaximum.toString(),
    };
  }

  handleCreditMinimumClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingCreditMinimum: true,
    }));
  };
  handleCreditMaximumClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingCreditMaximum: true,
    }));
  };

  handleCreditsMinimumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.handleMinimumCreditsSaveClick();
  };
  handleCreditsMaximumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.handleMaximumCreditsSaveClick();
  };

  handleMinimumCreditsSaveClick = () => {
    const newCreditMinimum = parseInt(this.state.creditMinimumValue, 10);
    if (isNaN(newCreditMinimum)) {
      this.handleMinimumCreditsCancelClick();
      return;
    }
    this.setState(previousState => ({
      ...previousState,
      editingCreditMinimum: false,
    }));
    this.props.onDegreeGroupUpdate(group => group.set('creditMinimum', newCreditMinimum));
  };
  handleMaximumCreditsSaveClick = () => {
    const newCreditMaximum = parseInt(this.state.creditMaximumValue, 10);
    if (isNaN(newCreditMaximum)) {
      this.handleMaximumCreditsCancelClick();
      return;
    }
    this.setState(previousState => ({
      ...previousState,
      editingCreditMaximum: false,
    }));
    this.props.onDegreeGroupUpdate(group => group.set('creditMaximum', newCreditMaximum));
  };

  handleMinimumCreditsCancelClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingCreditMinimum: false,
      creditMinimumValue: this.props.masteredDegreeGroup.creditMinimum.toString(),
    }));
  };
  handleMaximumCreditsCancelClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingCreditMaximum: false,
      creditMaximumValue: this.props.masteredDegreeGroup.creditMaximum.toString(),
    }));
  };

  handleCreditsMinimumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      creditMinimumValue: newValue,
    }));
  };
  handleCreditsMaximumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      creditMaximumValue: newValue,
    }));
  };

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
            <Row>
              <CreditHourBlock>
                {!this.state.editingCreditMinimum ? (
                  <CreditHourNumber onClick={this.handleCreditMinimumClick}>
                    {masteredDegreeGroup.creditMinimum}
                  </CreditHourNumber>
                ) : (
                  <Form onSubmit={this.handleCreditsMinimumSubmit}>
                    <Input
                      type="number"
                      value={this.state.creditMinimumValue}
                      onChange={this.handleCreditsMinimumChange}
                      innerRef={this.handleAndSelectRef}
                    />
                  </Form>
                )}
                <CreditsLabel>credit minimum</CreditsLabel>
                {!this.state.editingCreditMinimum ? (
                  <ButtonRow>
                    <Button onClick={this.handleCreditMinimumClick}>
                      <Fa icon="pencil" />
                      <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
                    </Button>
                  </ButtonRow>
                ) : (
                  <ButtonRow>
                    <Button onClick={this.handleMinimumCreditsCancelClick}>
                      <Fa icon="times" />
                      <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
                    </Button>
                    <Button onClick={this.handleMinimumCreditsSaveClick}>
                      <Fa icon="check" color={styles.blue} />
                      <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
                    </Button>
                  </ButtonRow>
                )}
              </CreditHourBlock>

              <CreditHourBlock>
                {!this.state.editingCreditMaximum ? (
                  <CreditHourNumber onClick={this.handleCreditMaximumClick}>
                    {masteredDegreeGroup.creditMaximum}
                  </CreditHourNumber>
                ) : (
                  <Form onSubmit={this.handleCreditsMaximumSubmit}>
                    <Input
                      type="number"
                      value={this.state.creditMaximumValue}
                      onChange={this.handleCreditsMaximumChange}
                      innerRef={this.handleAndSelectRef}
                    />
                  </Form>
                )}
                <CreditsLabel>credit maximum</CreditsLabel>
                {!this.state.editingCreditMaximum ? (
                  <ButtonRow>
                    <Button onClick={this.handleCreditMaximumClick}>
                      <Fa icon="pencil" />
                      <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
                    </Button>
                  </ButtonRow>
                ) : (
                  <ButtonRow>
                    <Button onClick={this.handleMaximumCreditsCancelClick}>
                      <Fa icon="times" />
                      <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
                    </Button>
                    <Button onClick={this.handleMaximumCreditsSaveClick}>
                      <Fa icon="check" color={styles.blue} />
                      <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
                    </Button>
                  </ButtonRow>
                )}
              </CreditHourBlock>
            </Row>
          </Card>
        </RightClickMenu>
      </Container>
    );
  }
}
