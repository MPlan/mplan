import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';

import { Page } from 'components/page';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { NewDegreeModal } from './components/new-degree-modal';

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

  handleCreateNewDegree = () => {};

  render() {
    const { newDegreeModalOpen } = this.state;
    return (
      <Page
        title="Degree Editor"
        subtitle={<Text color={styles.textLight}>Edit degrees here</Text>}
        titleLeft={<PrimaryButton onClick={this.handleNewDegreeOpen}>+ New Degree</PrimaryButton>}
      >
        <NewDegreeModal
          open={newDegreeModalOpen}
          onClose={this.handleNewDegreeClose}
          onCreateNewDegree={this.handleCreateNewDegree}
        />
      </Page>
    );
  }
}
