import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Input } from 'components/input';
import { Breadcrumbs as _Breadcrumbs } from 'components/breadcrumbs';
import { RightClickMenu } from 'components/right-click-menu';
import { InlineEdit } from 'components/inline-edit';
import { VerticalBar } from 'components/vertical-bar';
import { DropdownMenu } from 'components/dropdown-menu';
import { Paragraph } from 'components/paragraph';
import { PrimaryButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';
import { Link } from 'components/link';
import { CreditHourEditor } from 'components/credit-hour-editor';

import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';
import { DescriptionEditor } from 'routes/degree-manager/components/description-editor';
import { PageNav } from 'routes/degree-manager/components/page-nav';

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
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
const Breadcrumbs = styled(_Breadcrumbs)`
  flex: 0 0 auto;
  margin-bottom: ${styles.space(0)};
`;
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;
const ActionSubtitle = styled(Text)`
  text-transform: uppercase;
  font-size: ${styles.space(-1)};
  margin-top: ${styles.space(-1)};
`;

interface CourseGroupDetailProps {
  name: string;
  descriptionHtml: string;
  creditMinimum: number;
  creditMaximum: number;
  onNameChange: (name: string) => void;
  onDescriptionChange: (descriptionHtml: string) => void;
  onCreditMinimumChange: (minimumCredits: number) => void;
  onCreditMaximumChange: (maximumCredits: number) => void;
  onBackClick: () => void;
  onPreviewClick: () => void;
}
interface CourseGroupDetailState {
  editingName: boolean;
}

export class CourseGroupDetail extends React.Component<
  CourseGroupDetailProps,
  CourseGroupDetailState
> {
  constructor(props: CourseGroupDetailProps) {
    super(props);

    this.state = {
      editingName: false,
    };
  }

  degreeDropdownAction = () => {};
  handleActions = () => {};

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.props.onNameChange(value);
  };
  handleNameBlur = () => {
    this.setState({ editingName: false });
  };
  handleNameEdit = () => {
    this.setState({ editingName: true });
  };

  render() {
    const {
      name,
      creditMinimum,
      creditMaximum,
      descriptionHtml,
      onBackClick,
      onPreviewClick,
      onDescriptionChange,
      onCreditMaximumChange,
      onCreditMinimumChange,
    } = this.props;

    const { editingName } = this.state;

    return (
      <Root>
        <Body>
          <Content>
            <PageNav backTitle="Back to degree" onBackClick={onBackClick} />
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
                      <TitleInput {...props} onChange={this.handleNameChange} />
                    )}
                    editing={editingName}
                    onBlur={this.handleNameBlur}
                    onEdit={this.handleNameEdit}
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
              <Paragraph>Edit the description of this course group here.</Paragraph>
              <Paragraph>
                The description will appear when the student clicks the "More info" link under the
                course group title. You can see how this looks this when you{' '}
                <Link onClick={onPreviewClick}>preview the degree</Link>.
              </Paragraph>
            </DescriptionEditor>
            <DegreeItem title="Credit hours">
              <DescriptionAction description={<>fewfods</>}>
                <CreditHourEditor creditHours={creditMinimum} onChange={onCreditMinimumChange} />
                <CreditHourEditor creditHours={creditMaximum} onChange={onCreditMaximumChange} />
              </DescriptionAction>
            </DegreeItem>
            <DegreeItem title="Default courses">
              <Paragraph>These are the courses that will appear initially.</Paragraph>
            </DegreeItem>
            <DegreeItem title="Allowed courses">
              <Paragraph>
                This is the allowed white-list of courses. These will be presented to the users as
                options to choose from.
              </Paragraph>
            </DegreeItem>
            <DegreeItem title="Summary">
              <DescriptionAction description={<>test</>}>
                <PrimaryButton>
                  <Fa icon="angleLeft" />
                  Back to degree
                </PrimaryButton>
                <ActionSubtitle>Your changes save automatically.</ActionSubtitle>
              </DescriptionAction>
            </DegreeItem>
          </Content>
        </Body>
      </Root>
    );
  }
}
