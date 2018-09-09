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
import { Breadcrumbs } from 'components/breadcrumbs';
import { OutlineButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';

import { DescriptionEditor } from 'routes/degree-manager/components/description-editor';
import { CreditHourMinimum } from 'routes/degree-manager/components/credit-hour-minimum';
import { PublishUnlist } from 'routes/degree-manager/components/publish-unlist';
import { CourseGroupSummary } from 'routes/degree-manager/components/course-group-summary';
import { DegreeSummary } from 'routes/degree-manager/components/degree-summary';

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
const ButtonRow = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  margin-bottom: ${styles.space(0)};
  align-items: center;
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
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;
const BackButton = styled(OutlineButton)`
  margin-right: ${styles.space(0)};
  font-size: ${styles.space(-1)};
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
        <Body>
          <Content>
            <ButtonRow>
              <BackButton onClick={onBackClick}>
                <Fa icon="angleLeft" />
                Back To Degrees
              </BackButton>
              <VerticalBar />
              <Breadcrumbs />
            </ButtonRow>
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
            <CourseGroupSummary masteredDegreeId={masteredDegree.id} />
            <DegreeSummary />
          </Content>
        </Body>
      </Root>
    );
  }
}
