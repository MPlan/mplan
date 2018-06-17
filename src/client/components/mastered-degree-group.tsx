import * as React from 'react';
import * as Model from '../models';
import * as Immutable from 'immutable';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';
import { Button } from './button';
import { Fa } from './fa';
import { EditableCourseList } from './editable-course-list';
import { Modal } from './modal';
import { activateOnEdit, selectTextFromInputRef } from 'utilities/refs';
const RichTextEditor = require('react-rte').default;

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
const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;
const DescriptionNonEdit = styled(View)`
  &,
  & * {
    font-family: ${styles.fontFamily};
  }
`;
const NameForm = styled.form`
  flex: 1;
`;
const NameInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
  font-family: ${styles.fontFamily};
`;

const headingActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
  delete: {
    text: 'Delete',
    icon: 'trash',
    color: styles.red,
  },
};

export interface MasteredDegreeGroupProps {
  masteredDegreeGroup: Model.MasteredDegreeGroup;
  onDegreeGroupUpdate: (
    update: (group: Model.MasteredDegreeGroup) => Model.MasteredDegreeGroup,
  ) => void;
  onDeleteGroup: () => void;
}

interface MasteredDegreeGroupState {
  editingCreditMinimum: boolean;
  editingCreditMaximum: boolean;
  creditMinimumValue: string;
  creditMaximumValue: string;
  editingDescription: boolean;
  editingName: boolean;
  descriptionValue: any;
  areYouSureModal: boolean;
}

export class MasteredDegreeGroup extends React.PureComponent<
  MasteredDegreeGroupProps,
  MasteredDegreeGroupState
> {
  nameInputRef = React.createRef<HTMLInputElement>();
  creditsMinimumRef = React.createRef<HTMLInputElement>();
  creditsMaximumRef = React.createRef<HTMLInputElement>();

  constructor(props: MasteredDegreeGroupProps) {
    super(props);
    const { masteredDegreeGroup } = props;
    this.state = {
      editingCreditMinimum: false,
      editingCreditMaximum: false,
      creditMinimumValue: masteredDegreeGroup.creditMinimum.toString(),
      creditMaximumValue: masteredDegreeGroup.creditMaximum.toString(),
      editingDescription: false,
      descriptionValue: RichTextEditor.createValueFromString(
        props.masteredDegreeGroup.descriptionHtml,
        'html',
      ),
      editingName: false,
      areYouSureModal: false,
    };
  }

  componentDidUpdate(_: MasteredDegreeGroupProps, previousState: MasteredDegreeGroupState) {
    activateOnEdit({
      editingBefore: previousState.editingName,
      editingNow: this.state.editingName,
      onEditChange: () => selectTextFromInputRef(this.nameInputRef),
    });

    activateOnEdit({
      editingBefore: previousState.editingCreditMaximum,
      editingNow: this.state.editingCreditMaximum,
      onEditChange: () => selectTextFromInputRef(this.creditsMaximumRef),
    });

    activateOnEdit({
      editingBefore: previousState.editingCreditMinimum,
      editingNow: this.state.editingCreditMinimum,
      onEditChange: () => selectTextFromInputRef(this.creditsMinimumRef),
    });
  }

  componentWillReceiveProps(nextProps: MasteredDegreeGroupProps) {
    if (nextProps.masteredDegreeGroup !== this.props.masteredDegreeGroup) {
      this.setState(previousState => ({
        ...previousState,
        editingDescription: false,
        descriptionValue: RichTextEditor.createValueFromString(
          nextProps.masteredDegreeGroup.descriptionHtml,
          'html',
        ),
      }));
    }
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

  handleHeadingActions = (action: keyof typeof headingActions) => {
    if (action === 'rename') {
      this.handleNameClick();
    } else if (action === 'delete') {
      this.setState(previousState => ({
        ...previousState,
        areYouSureModal: true,
      }));
    }
  };

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

  handleDescriptionChange = (descriptionValue: any) => {
    this.setState(previousState => ({
      ...previousState,
      descriptionValue,
    }));
  };

  handleDescriptionCancel = () => {
    this.setState(previousState => ({
      ...previousState,
      editingDescription: false,
      descriptionValue: RichTextEditor.createValueFromString(
        this.props.masteredDegreeGroup.descriptionHtml,
        'html',
      ),
    }));
  };

  handleDescriptionSave = () => {
    this.setState(previousState => ({
      ...previousState,
      editingDescription: false,
    }));
    this.props.onDegreeGroupUpdate(group =>
      group.set('descriptionHtml', this.state.descriptionValue.toString('html')),
    );
  };

  handleDescriptionEdit = () => {
    this.setState(previousState => ({
      ...previousState,
      editingDescription: true,
    }));
  };

  handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState(previousState => ({
      ...previousState,
      editingName: false,
    }));
    const value = (e.currentTarget.querySelector('.name-input') as HTMLInputElement).value;
    this.props.onDegreeGroupUpdate(group => group.set('name', value));
  };

  handleNameClick = () => {
    this.setState(previousState => ({
      ...previousState,
      editingName: true,
    }));
  };

  handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    this.setState(previousState => ({
      ...previousState,
      editingName: false,
    }));
    const value = e.currentTarget.value;
    this.props.onDegreeGroupUpdate(group => group.set('name', value));
  };

  handleAreYouSureCancel = () => {
    this.setState(previousState => ({
      ...previousState,
      areYouSureModal: false,
    }));
  };

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
            {/*if*/ this.state.editingName ? (
              <NameForm onSubmit={this.handleNameSubmit}>
                <NameInput
                  className="name-input"
                  type="text"
                  innerRef={this.nameInputRef}
                  onBlur={this.handleNameBlur}
                  defaultValue={masteredDegreeGroup.name}
                />
              </NameForm>
            ) : (
              <Header onClick={this.handleNameClick}>{masteredDegreeGroup.name}</Header>
            )}

            <DropdownMenu
              header={masteredDegreeGroup.name}
              actions={headingActions}
              onAction={this.handleHeadingActions}
            />
          </HeaderRow>
        </RightClickMenu>
        <Card>
          <Row>
            <Text style={{ fontWeight: 'bold' }}>Description</Text>
          </Row>
          <Row>
            <Text color={styles.textLight}>
              This description is displayed above the degree groups in the student's degree view. It
              may be helpful to add links to degree group requirements such as the DDC allowed
              courses for "Written and oral communication".
            </Text>
          </Row>
          {/*if*/ this.state.editingDescription ? (
            <View>
              <RichTextEditor
                value={this.state.descriptionValue}
                onChange={this.handleDescriptionChange}
              />
              <ButtonContainer>
                <Button onClick={this.handleDescriptionCancel}>
                  <Fa icon="times" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
                </Button>
                <Button onClick={this.handleDescriptionSave}>
                  <Fa icon="check" color={styles.blue} />
                  <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
                </Button>
              </ButtonContainer>
            </View>
          ) : (
            <View>
              <Row>
                <Button onClick={this.handleDescriptionEdit}>
                  <Fa icon="pencil" />
                  <Text style={{ marginLeft: styles.space(-1) }}>Edit</Text>
                </Button>
              </Row>
              <DescriptionNonEdit
                dangerouslySetInnerHTML={{ __html: this.props.masteredDegreeGroup.descriptionHtml }}
              />
            </View>
          )}
          <Hr />
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
                    innerRef={this.creditsMinimumRef}
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
                    innerRef={this.creditsMaximumRef}
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
                currentCourses={masteredDegreeGroup.defaultCourses()}
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
                currentCourses={masteredDegreeGroup.allowedCourses()}
                onChangeCourses={this.handleChangeAllowListCourses}
              />
            </View>
          </Split>
        </Card>
        <Modal
          open={this.state.areYouSureModal}
          title={`Are you sure you want to delete ${masteredDegreeGroup.name}?`}
          onBlurCancel={this.handleAreYouSureCancel}
        >
          <Row style={{ justifyContent: 'space-between' }}>
            <Button onClick={this.props.onDeleteGroup}>
              Yes, delete {masteredDegreeGroup.name}
            </Button>
            <Button onClick={this.handleAreYouSureCancel}>No, keep it.</Button>
          </Row>
        </Modal>
      </Container>
    );
  }
}
