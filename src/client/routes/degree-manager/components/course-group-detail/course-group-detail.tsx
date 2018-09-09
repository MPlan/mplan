import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Input } from 'components/input';
import { Breadcrumbs } from 'components/breadcrumbs';
import { RightClickMenu } from 'components/right-click-menu';
import { InlineEdit } from 'components/inline-edit';
import { VerticalBar } from 'components/vertical-bar';
import { DropdownMenu } from 'components/dropdown-menu';

import { DegreeItem } from '../degree-detail/components/degree-item';
import { DescriptionAction } from '../degree-detail/components/description-action';
import { DescriptionEditor } from '../degree-detail/components/description-editor';

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

interface CourseGroupDetailProps {
  name: string;
  onNameChange: (name: string) => void;
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
    this.setState({ editingName: false });
  };

  render() {
    const { name } = this.props;
    const { editingName } = this.state;

    return (
      <Root>
        <Body>
          <Content>
            <Breadcrumbs />
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
            <DescriptionEditor />
            <DegreeItem title="Credit hours">
              <DescriptionAction description={<>fewfods</>}>tesfds</DescriptionAction>
            </DegreeItem>
          </Content>
        </Body>
      </Root>
    );
  }
}
