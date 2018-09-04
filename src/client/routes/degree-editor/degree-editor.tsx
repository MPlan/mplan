import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { Route, RouteComponentProps } from 'react-router';
import { get } from 'utilities/get';

import { Page } from 'components/page';
import { View, ViewProps } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { NewDegreeModal } from './components/new-degree-modal';
import { DegreeList } from './components/degree-list';
import { DegreeDetail } from './components/degree-detail';

const Content = styled(View)`
  max-width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
`;
interface SlideProps extends ViewProps {
  slid?: boolean;
}
const SlideLeft = styled<SlideProps>(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: ${props => (props.slid ? '-100%' : '0')};
  transition: all 500ms;
`;
const SlideRight = styled<SlideProps>(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: ${props => (props.slid ? '100%' : '0')};
  transition: all 500ms;
`;

interface DegreeEditorProps {
  masteredDegrees: Model.MasteredDegree.Model[];
  onCreateDegree: (degreeName: string) => void;
  onMasteredDegreeClick: (masteredDegreeId: string) => void;
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

  renderDegreeList = (props: RouteComponentProps<any>) => {
    const { masteredDegrees, onMasteredDegreeClick } = this.props;

    return (
      <SlideLeft slid={!get(props, _ => _.match.isExact, false)}>
        <Page
          title="Degree Editor"
          subtitle={<Text color={styles.textLight}>Edit degrees here</Text>}
          titleLeft={<PrimaryButton onClick={this.handleNewDegreeOpen}>+ New Degree</PrimaryButton>}
        >
          <DegreeList
            masteredDegrees={masteredDegrees}
            onMasteredDegreeClick={onMasteredDegreeClick}
          />
        </Page>
      </SlideLeft>
    );
  };

  renderDegreeDetail = (props: RouteComponentProps<{ masteredDegreeId: string }>) => {
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);
    const degreeDetail = masteredDegreeId ? (
      <DegreeDetail masteredDegreeId={masteredDegreeId} />
    ) : null;

    return <SlideRight slid={!props.match}>{degreeDetail}</SlideRight>;
  };

  render() {
    const { newDegreeModalOpen } = this.state;
    return (
      <React.Fragment>
        <Content>
          <Route path="/degree-editor" children={this.renderDegreeList} />
          <Route path="/degree-editor/:masteredDegreeId" children={this.renderDegreeDetail} />
        </Content>

        <NewDegreeModal
          open={newDegreeModalOpen}
          onClose={this.handleNewDegreeClose}
          onCreateNewDegree={this.props.onCreateDegree}
        />
      </React.Fragment>
    );
  }
}
