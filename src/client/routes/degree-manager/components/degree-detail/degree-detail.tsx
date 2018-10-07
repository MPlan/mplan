import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Input } from 'components/input';
import { VerticalBar } from 'components/vertical-bar';
import { DropdownMenu } from 'components/dropdown-menu';
import { InlineEdit } from 'components/inline-edit';
import { RightClickMenu } from 'components/right-click-menu';
import { Paragraph } from 'components/paragraph';
import { DeleteConfirmationModal } from 'components/delete-confirmation-modal';

import { DescriptionEditor } from 'routes/degree-manager/components/description-editor';
import { CreditHourMinimum } from 'routes/degree-manager/components/credit-hour-minimum';
import { PublishUnlist } from 'routes/degree-manager/components/publish-unlist';
import { RequirementGroupList } from 'routes/degree-manager/components/requirement-group-list';
import { DegreeSummary } from 'routes/degree-manager/components/degree-summary';
import { PageNav } from 'routes/degree-manager/components/page-nav';

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
  /* position: relative; */
`;
const Body = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
  padding: 0 ${styles.space(1)};
`;
const Content = styled(View)`
  flex: 1 1 auto;
  width: 50rem;
  max-width: 100%;
  margin: ${styles.space(1)} auto;
  & > * {
    flex: 0 0 auto;
  }
`;
const TitleRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${styles.space(0)};
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
`;
const TitleInput = styled(Input)`
  color: ${styles.textLight};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
  background-color: transparent;
  border: 1px solid ${styles.grayLight};
  outline: none;
  padding: 0;
`;

interface DegreeDetailProps {
  id: string;
  name: string;
  descriptionHtml: string;
  published: boolean;
  minimumCreditHours: number;
  onBackClick: () => void;
  onDelete: () => void;
  onEditDegreeName: (newName: string) => void;
  onPreview: () => void;
  onDescriptionChange: (description: string) => void;
  onPublishChange: (published: boolean) => void;
  onMinimumCreditHoursChange: (minimumCreditHours: number) => void;
  onMount: () => void;
  onWillUnmount: () => void;
}
interface DegreeDetailState {
  editingDegreeName: boolean;
  deleteConfirmationOpen: boolean;
}

export class DegreeDetail extends React.Component<DegreeDetailProps, DegreeDetailState> {
  degreeDropdownAction = {
    rename: {
      icon: 'pencil',
      text: 'Rename degree',
    },
    delete: {
      icon: 'trash',
      color: styles.red,
      text: 'Delete degree',
    },
  };

  constructor(props: DegreeDetailProps) {
    super(props);

    this.state = {
      editingDegreeName: false,
      deleteConfirmationOpen: false,
    };
  }

  componentDidMount() {
    this.props.onMount();
  }

  componentWillUnmount() {
    this.props.onWillUnmount();
  }

  handleDegreeNameBlur = () => {
    this.setState({ editingDegreeName: false });
  };
  handleDegreeNameEdit = () => {
    this.setState({ editingDegreeName: true });
  };
  handleDegreeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.props.onEditDegreeName(value);
  };

  handleActions = (key: any) => {
    if (key === 'rename') {
      this.handleDegreeNameEdit();
      return;
    }

    if (key === 'delete') {
      this.setState({ deleteConfirmationOpen: true });
      return;
    }
  };

  handleDeleteConfirmationClose = () => {
    this.setState({ deleteConfirmationOpen: false });
  };

  render() {
    const {
      id,
      name,
      onBackClick,
      descriptionHtml,
      minimumCreditHours,
      onPreview,
      onDelete,
      onDescriptionChange,
      published,
      onPublishChange,
      onMinimumCreditHoursChange,
    } = this.props;

    const { editingDegreeName, deleteConfirmationOpen } = this.state;
    return (
      <>
        <Root>
          <Body>
            <Content>
              <PageNav backTitle="Back to degrees" onBackClick={onBackClick} />
              <RightClickMenu
                header={name}
                actions={this.degreeDropdownAction}
                onAction={this.handleActions}
              >
                {props => (
                  <TitleRow {...props}>
                    <InlineEdit
                      value={name}
                      renderDisplay={props => <Title {...props} />}
                      renderInput={props => (
                        <TitleInput {...props} onChange={this.handleDegreeNameChange} />
                      )}
                      editing={editingDegreeName}
                      onBlur={this.handleDegreeNameBlur}
                      onEdit={this.handleDegreeNameEdit}
                    />
                    <VerticalBar />
                    <DropdownMenu
                      header={name}
                      actions={this.degreeDropdownAction}
                      onAction={this.handleActions}
                    />
                  </TitleRow>
                )}
              </RightClickMenu>
              <DescriptionEditor descriptionHtml={descriptionHtml} onChange={onDescriptionChange}>
                <Paragraph>Edit the description of this degree here.</Paragraph>
                <Paragraph>
                  The degree description will appear under the degree name on the student's degree
                  worksheet. It is recommend to include a link to any official degree
                  curriculums/requirements here.
                </Paragraph>
              </DescriptionEditor>
              <CreditHourMinimum
                minimumCreditHours={minimumCreditHours}
                onChange={onMinimumCreditHoursChange}
              />
              <RequirementGroupList masteredDegreeId={id} />
              <PublishUnlist published={published} onChange={onPublishChange} />
              <DegreeSummary />
            </Content>
          </Body>
        </Root>
        <DeleteConfirmationModal
          title={`Are you sure you want to delete "${name}"?`}
          open={deleteConfirmationOpen}
          confirmationText="Yes, delete it."
          onClose={this.handleDeleteConfirmationClose}
          onConfirmDelete={onDelete}
        />
      </>
    );
  }
}
