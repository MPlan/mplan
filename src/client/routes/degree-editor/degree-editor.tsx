import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Page } from 'components/page';
import { View } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { NewDegreeModal } from './components/new-degree-modal';
import { DegreeList as _DegreeList } from './components/degree-list';

const Content = styled(View)``;
const DegreeList =  styled(_DegreeList)`
  margin: auto;
`;

interface DegreeEditorProps {
  masteredDegrees: Model.MasteredDegree.Model[];
  onCreateDegree: (degreeName: string) => void;
}
interface DegreeEditorState {
  newDegreeModalOpen: boolean;
}

export class DegreeEditor extends React.PureComponent<DegreeEditorProps, DegreeEditorState> {
  constructor(props: DegreeEditorProps) {
    super(props);

    this.state = {
      newDegreeModalOpen: false,
    };
  }

  handleNewDegreeOpen = () => {
    this.setState({ newDegreeModalOpen: true });
  };
  handleNewDegreeClose = () => {
    this.setState({ newDegreeModalOpen: false });
  };

  render() {
    const { masteredDegrees } = this.props;
    const { newDegreeModalOpen } = this.state;
    return (
      <Page
        title="Degree Editor"
        subtitle={<Text color={styles.textLight}>Edit degrees here</Text>}
        titleLeft={<PrimaryButton onClick={this.handleNewDegreeOpen}>+ New Degree</PrimaryButton>}
      >
        <Content>
          <DegreeList masteredDegrees={masteredDegrees} />
        </Content>

        <NewDegreeModal
          open={newDegreeModalOpen}
          onClose={this.handleNewDegreeClose}
          onCreateNewDegree={this.props.onCreateDegree}
        />
      </Page>
    );
  }
}
