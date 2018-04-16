import * as React from 'react';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';
import { Button } from './button';
import { Fa } from './fa';
import { EditableCourseList } from './editable-course-list';

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
  margin-bottom: ${styles.space(-1)};
`;
const Split = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
  & > * {
    flex: 1;
  }
`;
const Hr = styled.hr`
  width: 100%;
  margin-bottom: ${styles.space(0)};
`;

const headingActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
};

export interface MasteredDegreeGroupProps {
  catalog: Model.Catalog;
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

  handleChangeDefaultCourses = (courses: Model.Course[]) => {
    this.props.onDegreeGroupUpdate(group => {
      return group.set('defaultIds', Immutable.List(courses).map(course => course.catalogId));
    });
  };

  handleChangeAllowListCourses = (courses: Model.Course[]) => {
    this.props.onDegreeGroupUpdate(group => {
      return group.set('allowListIds', Immutable.List(courses).map(course => course.catalogId));
    });
  };

  render() {
    const { masteredDegreeGroup, catalog } = this.props;
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
        </RightClickMenu>
        <Card>
          <Row>
            <Text style={{ fontWeight: 'bold' }}>Credit caps</Text>
          </Row>
          <Row>
            <Text color={styles.textLight}>
              Credit minimum and maximums can be set for degree groups. Students will see a warning
              if the courses they put into this degree group is lower or higher than the credit
              minimum and maximums respectively.
            </Text>
          </Row>

          <Split>
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
          </Split>
          {/*if*/ masteredDegreeGroup.creditMinimum > masteredDegreeGroup.creditMaximum ? (
            <Text color={styles.red}>
              WARNING: The credit minimum is greater than the credit maximum.
            </Text>
          ) : null}
          <Split>
            <View style={{ marginRight: styles.space(0) }}>
              <Row>
                <Text style={{ fontWeight: 'bold' }}>Defaults</Text>
              </Row>
              <Row>
                <Text color={styles.textLight}>
                  These courses will be the default courses shown to the student in this degree
                  group. It is recommended to populate this when the student has little to no choice
                  in what has to be taken. If there is a choice, it may be better to leave the
                  defaults blank and just populate the Allow List.
                </Text>
              </Row>
              <Hr />
              <EditableCourseList
                currentCourses={masteredDegreeGroup.defaultIds
                  .map(id => catalog.courseMap.get(id)!)
                  .filter(x => !!x)
                  .toArray()}
                onChangeCourses={this.handleChangeDefaultCourses}
              />
            </View>
            <View>
              <Row>
                <Text style={{ fontWeight: 'bold' }}>Allow list</Text>
              </Row>
              <Row>
                <Text color={styles.textLight}>
                  If a student tries to add a course that is not in the Allow List below, they will
                  see a warning. To disable the Allow List, remove all courses from it.
                </Text>
              </Row>
              <Hr />
              <EditableCourseList
                currentCourses={masteredDegreeGroup.allowListIds
                  .map(id => catalog.courseMap.get(id)!)
                  .filter(x => !!x)
                  .toArray()}
                onChangeCourses={this.handleChangeAllowListCourses}
              />
            </View>
          </Split>
        </Card>
      </Container>
    );
  }
}
