import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Input } from 'components/input';
import { PrimaryButton, TransparentButton } from 'components/button';
import { Fa } from 'components/fa';
import { DropdownMenu } from 'components/dropdown-menu';
import { InlineEdit } from 'components/inline-edit';
import { RightClickMenu } from 'components/right-click-menu';
import { Breadcrumbs as _Breadcrumbs } from 'components/breadcrumbs';

import { DescriptionEditor } from './components/description-editor';
import { CreditHourMinimum } from './components/credit-hour-minimum';
import { PublishUnlist } from './components/publish-unlist';
import { CourseGroupSummary } from './components/course-group-summary';
import { DegreeSummary } from './components/degree-summary';

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
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
const BackToDegreeButton = styled(TransparentButton)`
  margin: ${styles.space(-1)} ${styles.space(0)};
  justify-content: flex-start;
`;
const AddCourseGroupButton = styled(PrimaryButton)`
  margin: ${styles.space(-1)} 0;
  border-radius: 999999px;
  box-shadow: ${styles.boxShadow(-1)};
`;
const FaLeft = styled(Fa)`
  margin-right: ${styles.space(-1)};
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
const VerticalBar = styled.div`
  flex: 0 0 auto;
  border-right: 1px solid ${styles.grayLight};
  width: 2px;
  margin-right: ${styles.space(0)};
  align-self: stretch;
`;
const PreviewButton = styled(PrimaryButton)`
  margin: ${styles.space(-1)} 0;
  margin-left: auto;
  margin-right: ${styles.space(0)};
`;
const IconRight = styled(Fa)`
  margin-left: ${styles.space(-1)};
`;
const LastRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${styles.space(0)};
`;
const ActionsBar = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(-2)};
  z-index: 1;
`;
const Breadcrumbs = styled(_Breadcrumbs)`
  flex: 0 0 auto;
  margin-bottom: ${styles.space(0)};
`;

interface DegreeDetailProps {
  masteredDegree: Model.MasteredDegree.Model;
  onBackClick: () => void;
  onEditDegreeName: (newName: string) => void;
  onPreview: () => void;
}
interface DegreeDetailState {
  editingDegreeName: boolean;
}

export class DegreeDetail extends React.Component<DegreeDetailProps, DegreeDetailState> {
  degreeDropdownAction = {
    rename: {
      icon: 'pencil',
      text: 'Rename degree',
    },
    add: {
      icon: 'plus',
      text: 'Add course group',
      color: styles.blue,
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
    };
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
  };

  render() {
    const { onBackClick, masteredDegree, onPreview } = this.props;
    const { editingDegreeName } = this.state;
    return (
      <Root>
        <ActionsBar>
          <BackToDegreeButton onClick={onBackClick}>
            <FaLeft icon="angleLeft" />
            Back
          </BackToDegreeButton>
          <PreviewButton onClick={onPreview}>
            Preview Degree <IconRight icon="angleRight" />
          </PreviewButton>
        </ActionsBar>
        <Body>
          <Content>
            <Breadcrumbs />
            <RightClickMenu
              header={masteredDegree.name}
              actions={this.degreeDropdownAction}
              onAction={this.handleActions}
            >
              {props => (
                <TitleRow {...props}>
                  <InlineEdit
                    value={masteredDegree.name}
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
                    header={masteredDegree.name}
                    actions={this.degreeDropdownAction}
                    onAction={this.handleActions}
                  />
                </TitleRow>
              )}
            </RightClickMenu>
            <PublishUnlist />
            <DescriptionEditor />
            <CreditHourMinimum />
            <CourseGroupSummary />
            <DegreeSummary />
          </Content>
        </Body>
      </Root>
    );
  }
}
