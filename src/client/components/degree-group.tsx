import * as React from 'react';
import * as Model from '../models';
import { View, ViewProps } from './view';
import { Text } from './text';
import { ActionableText } from './actionable-text';
import styled from 'styled-components';
import { DegreeGroupCourse } from './degree-group-course';
import * as styles from '../styles';
import { wait } from '../../utilities/utilities';
import { DropdownMenu } from './dropdown-menu';
import { RightClickMenu } from './right-click-menu';

const Container = styled(View)`
  max-width: 25rem;
  width: 25rem;
  margin-right: ${styles.space(2)};
  margin-bottom: ${styles.space(2)};
`;
const Header = styled(View)`
  margin-bottom: ${styles.space(0)};
  color: ${styles.textLight};
  & ${Text} {
    color: ${styles.textLight};
  }
`;
const NameAndCredits = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
interface NameProps extends ViewProps {
  editable?: boolean;
}
const Name = styled<NameProps>(Text)`
  flex: 1;
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  &:hover {
    ${props => (props.editable ? 'text-decoration: underline;' : '')};
  }
`;
const NameForm = styled.form`
  margin-right: auto;
`;
const NameInput = styled.input`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  background-color: transparent;
  border: none;
  border-bottom: solid 0.1rem ${styles.textLight};
  outline: none;
  font-family: ${styles.fontFamily};
`;
const Credits = styled(Text)`
  margin-right: ${styles.space(-1)};
`;
const Description = styled(Text)``;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
`;
const NameHeader = styled(Text)`
  font-size: ${styles.space(-1)};
  margin-right: auto;
`;
const CompletedHeader = styled(Text)`
  font-size: ${styles.space(-1)};
  width: 5rem;
  text-align: right;
  margin-right: ${styles.space(0)};
`;
const CardHeaders = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const Courses = styled(View)``;
const AddCourseContainer = styled(View)``;

export interface DegreeGroupProps {
  degreeGroup: Model.DegreeGroup;
  onNameChange: (newName: string) => void;
  onAddCourseClick: () => void;
  onDeleteCourse: (course: string | Model.Course) => void;
  onDeleteGroup: () => void;
}

interface DegreeGroupState {
  editingName: boolean;
}

const groupActions = {
  rearrange: { text: 'Rearrange', icon: 'bars' },
  delete: { text: 'Delete', icon: 'trash', color: styles.red },
};

export class DegreeGroup extends React.Component<DegreeGroupProps, DegreeGroupState> {
  constructor(props: DegreeGroupProps) {
    super(props);

    this.state = {
      editingName: false,
    };
  }

  nameInputElement: HTMLInputElement | undefined;

  handleNameClick = async () => {
    this.setState(previousState => ({
      ...previousState,
      editingName: true,
    }));
    await wait(0);
    if (!this.nameInputElement) return;

    this.nameInputElement.focus();
    this.nameInputElement.select();
  };

  handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState(previousState => ({
      ...previousState,
      editingName: false,
    }));
  };

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.props.onNameChange(value);
  };

  handleNameBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      editingName: false,
    }));
  };

  handleNameInputRef = (e: HTMLInputElement | undefined) => {
    this.nameInputElement = e;
  };

  handleGroupAction = (action: keyof typeof groupActions) => {
    console.log('action', action);
    if (action === 'delete') {
      this.props.onDeleteGroup();
    }
  };

  render() {
    const { degreeGroup } = this.props;
    const creditHoursMin = this.props.degreeGroup.courses.reduce(
      (creditHoursMin, next) =>
        next instanceof Model.Course ? next.creditsMin || next.creditHoursMin || 0 : creditHoursMin,
      0,
    );
    const creditHoursMax = this.props.degreeGroup.courses.reduce(
      (creditHoursMax, next) =>
        next instanceof Model.Course ? next.credits || next.creditHours || 0 : 0,
      0,
    );

    return (
      <RightClickMenu actions={groupActions} onAction={this.handleGroupAction}>
        <Container>
          <Header>
            <NameAndCredits>
              {this.state.editingName ? (
                <NameForm onSubmit={this.handleNameSubmit}>
                  <NameInput
                    innerRef={this.handleNameInputRef}
                    onChange={this.handleNameChange}
                    onBlur={this.handleNameBlur}
                    defaultValue={degreeGroup.name}
                  />
                </NameForm>
              ) : (
                <Name onClick={this.handleNameClick} editable={true}>
                  {degreeGroup.name}
                </Name>
              )}
              <Credits>
                {/*if*/ creditHoursMin === creditHoursMax
                  ? `${creditHoursMin}`
                  : `${creditHoursMin} - ${creditHoursMax}`}&nbsp;credits
              </Credits>
              <DropdownMenu actions={groupActions} onAction={this.handleGroupAction} />
            </NameAndCredits>
            <Description>{degreeGroup.description}</Description>
          </Header>
          <Card>
            <CardHeaders>
              <NameHeader>Course name</NameHeader>
              <CompletedHeader>Completed ?</CompletedHeader>
            </CardHeaders>
            <Courses>
              {degreeGroup.courses.map(course => (
                <DegreeGroupCourse
                  key={course instanceof Model.Course ? course.id : course}
                  course={course}
                  onChange={() => {}}
                  onRearrange={() => {}}
                  onDelete={() => this.props.onDeleteCourse(course)}
                />
              ))}
            </Courses>
            <AddCourseContainer>
              <ActionableText small onClick={this.props.onAddCourseClick}>
                Add course to this group...
              </ActionableText>
            </AddCourseContainer>
          </Card>
        </Container>
      </RightClickMenu>
    );
  }
}
