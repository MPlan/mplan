import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Button } from './button';
import { Fa } from './fa';

const Container = styled(View)``;
const Header = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
`;
const SubHeader = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  color: ${styles.textLight};
`;
const EditButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${styles.space(1)};
  outline: none;
  color: ${styles.gray};
  &:hover,
  &:focus {
    color: ${styles.grayDark};
  }
  &:active {
    color: ${styles.black};
  }
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;
const Row = styled(View)`
  flex-direction: row;
  align-items: flex-start;
`;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
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
  font-size: ${styles.space(2)};
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
const Label = styled(Text)``;

interface DegreeCreditHoursProps {
  minimumCredits: number;
  onChange: (newMinimumCredits: number) => void;
}
interface DegreeCreditHoursState {
  editing: boolean;
  value: string;
}

export class DegreeCreditHours extends React.Component<
  DegreeCreditHoursProps,
  DegreeCreditHoursState
> {
  constructor(props: DegreeCreditHoursProps) {
    super(props);
    this.state = {
      editing: false,
      value: props.minimumCredits.toString(),
    };
  }

  componentWillReceiveProps(nextProps: DegreeCreditHoursProps) {
    this.setState(previousState => ({
      ...previousState,
      value: nextProps.minimumCredits.toString(),
    }));
  }

  handleEditClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editing: true,
    }));
  };

  handleSaveClick = () => {
    const newCreditMinimum = parseInt(this.state.value, 10);
    if (isNaN(newCreditMinimum)) {
      this.handleCancelClick();
      return;
    }
    this.setState(previousState => ({
      ...previousState,
      editing: false,
    }));
    this.props.onChange(newCreditMinimum);
  };
  handleCancelClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editing: false,
      value: this.props.minimumCredits.toString(),
    }));
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.handleSaveClick();
  };

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toString();
    this.setState(previousState => ({
      ...previousState,
      value,
    }));
  };

  handleInputRef = (e: HTMLInputElement | null | undefined) => {
    if (!e) return;
    e.focus();
    e.select();
  };

  render() {
    return (
      <Container>
        <Header>Credit hour minimum</Header>
        <SubHeader>
          Use this section to set a minimum credit hour requirement for this degree. A warning will
          show if the student fails to total this many credits in his or her plan.
        </SubHeader>
        <Card>
          <Row>
            <CreditHourBlock>
              {!this.state.editing ? (
                <CreditHourNumber>{this.props.minimumCredits}</CreditHourNumber>
              ) : (
                <Form onSubmit={this.handleSubmit}>
                  <Input
                    type="number"
                    value={this.state.value}
                    onChange={this.handleInput}
                    innerRef={this.handleInputRef}
                  />
                </Form>
              )}
              <Label>credits required</Label>
            </CreditHourBlock>
            {!this.state.editing ? (
              <ButtonRow>
                <Button onClick={this.handleEditClick}>
                  <Fa icon="pencil" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
                </Button>
              </ButtonRow>
            ) : (
              <ButtonRow>
                <Button onClick={this.handleCancelClick}>
                  <Fa icon="times" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
                </Button>
                <Button onClick={this.handleSaveClick}>
                  <Fa icon="check" color={styles.blue} />
                  <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
                </Button>
              </ButtonRow>
            )}
          </Row>
        </Card>
      </Container>
    );
  }
}
