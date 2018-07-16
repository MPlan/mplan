import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { DropdownMenu } from 'components/dropdown-menu';
import { RightClickMenu } from 'components/right-click-menu';

import { DegreeGroupCourse } from './degree-group-course';

import { wait, shallowEqualIgnoringFunctions } from 'utilities/utilities';
import { activateOnEdit, selectTextFromInputRef } from 'utilities/refs';

const Container = styled(View)`
  max-width: 24rem;
  width: 24rem;
  margin-right: ${styles.space(2)};
  margin-bottom: ${styles.space(2)};
`;
const Header = styled(View)`
  margin-bottom: ${styles.space(0)};
  color: ${styles.textLight};
`;
const NameAndCredits = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
interface NameProps extends ViewProps {
  editable?: boolean;
}
const Name = styled<NameProps>(Text as any)`
  flex: 1;
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  &:hover {
    ${props => (props.editable ? 'text-decoration: underline;' : '')};
  }
  color: ${styles.textLight};
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
  color: ${styles.textLight};
`;
const Description = styled(Text)`
  color: ${styles.textLight};
`;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
  flex: 1;
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
const Courses = styled(View)`
  flex: 1;
`;
const AddCourseContainer = styled(View)``;

export interface DegreeGroupProps {
  degreeGroup: Model.DegreeGroup;
  onNameChange: (newName: string) => void;
  onAddCourse: () => void;
  onDeleteCourse: (course: string | Model.Course) => void;
  onDeleteGroup: () => void;
  onCourseCompletedToggle: (course: string | Model.Course) => void;
  onHeaderClick: () => void;
  onReorderCoursesStart: () => void;
  onReorderGroupsStart: () => void;
}

interface DegreeGroupState {
  editingName: boolean;
}

export class DegreeGroup extends React.Component<DegreeGroupProps, DegreeGroupState> {
  inputRef = React.createRef<HTMLInputElement>();
  constructor(props: DegreeGroupProps) {
    super(props);

    this.state = {
      editingName: false,
    };
  }

  componentDidUpdate(_: any, previousState: DegreeGroupState) {
    activateOnEdit({
      editingBefore: previousState.editingName,
      editingNow: this.state.editingName,
      onEditChange: () => selectTextFromInputRef(this.inputRef),
    });
  }

  shouldComponentUpdate(nextProps: DegreeGroupProps, nextState: DegreeGroupState) {
    if (!shallowEqualIgnoringFunctions(this.state, nextState)) return true;
    if (!shallowEqualIgnoringFunctions(this.props, nextProps)) return true;
    return false;
  }

  nameInputElement: HTMLInputElement | undefined;

  handleNameClick = async () => {
    if (this.props.degreeGroup.renameable()) {
      this.setState(previousState => ({
        ...previousState,
        editingName: true,
      }));
      await wait(0);
      if (!this.nameInputElement) return;

      this.nameInputElement.focus();
      this.nameInputElement.select();
    } else {
      this.props.onHeaderClick();
    }
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

  get groupActions() {
    const renameAction = this.props.degreeGroup.renameable()
      ? {
          rename: { text: 'Rename', icon: 'pencil' },
          delete: { text: 'Delete group', icon: 'trash', color: styles.red },
        }
      : {};
    return {
      rearrange: { text: 'Reorder groups', icon: 'bars' },
      add: { text: 'Edit courses', icon: 'edit', color: styles.blue },
      ...renameAction,
    } as { [key: string]: { text: any; icon: any; color?: any } };
  }

  handleGroupAction = (action: any) => {
    if (action === 'delete') {
      this.props.onDeleteGroup();
    } else if (action === 'rename') {
      this.handleNameClick();
    } else if (action === 'add') {
      this.props.onAddCourse();
    } else if (action === 'rearrange') {
      this.props.onReorderGroupsStart();
    }
  };

  render() {
    const { degreeGroup } = this.props;
    const courses = degreeGroup.courses();
    const creditHoursMin = courses.reduce(
      (creditHoursMin, next) =>
        (next instanceof Model.Course ? next.creditsMin || next.creditHoursMin || 0 : 0) +
        creditHoursMin,
      0,
    );
    const creditHoursMax = courses.reduce(
      (creditHoursMax, next) =>
        (next instanceof Model.Course ? next.credits || next.creditHours || 0 : 0) + creditHoursMax,
      0,
    );

    const menuHeader = this.props.degreeGroup.name;

    return (
      <Container>
        <RightClickMenu
          header={menuHeader}
          actions={this.groupActions}
          onAction={this.handleGroupAction}
        >
          <Header>
            <NameAndCredits>
              {this.state.editingName ? (
                <NameForm onSubmit={this.handleNameSubmit}>
                  <NameInput
                    innerRef={this.inputRef}
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
              <DropdownMenu
                header={menuHeader}
                actions={this.groupActions}
                onAction={this.handleGroupAction}
              />
            </NameAndCredits>
            {degreeGroup.customGroup ? (
              <Description>Custom Group</Description>
            ) : (
              <ActionableText onClick={this.handleNameClick}>More info</ActionableText>
            )}
          </Header>
          <Card>
            <CardHeaders>
              <NameHeader>Course name</NameHeader>
              <CompletedHeader>Completed ?</CompletedHeader>
            </CardHeaders>
            <Courses>
              {courses.map(course => (
                <DegreeGroupCourse
                  completed={degreeGroup.completedCourseIds.includes(
                    course instanceof Model.Course ? course.id : course,
                  )}
                  key={course instanceof Model.Course ? course.id : course}
                  course={course}
                  onChange={() => this.props.onCourseCompletedToggle(course)}
                  onRearrange={() => this.props.onReorderCoursesStart()}
                  onDelete={() => this.props.onDeleteCourse(course)}
                />
              ))}
            </Courses>
            <AddCourseContainer>
              <ActionableText small onClick={this.props.onAddCourse}>
                Add course to this group...
              </ActionableText>
            </AddCourseContainer>
          </Card>
        </RightClickMenu>
      </Container>
    );
  }
}
