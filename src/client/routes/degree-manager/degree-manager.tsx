import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { Route, RouteComponentProps } from 'react-router';
import { get } from 'utilities/get';

import { Page } from 'components/page';
import { View } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { NewDegreeModal } from './components/new-degree-modal';
import { DegreeList } from './components/degree-list';
import { DegreeDetail } from './components/degree-detail';
import { Slide } from './components/slide';
import { DegreePreview } from './components/degree-preview';

const Content = styled(View)`
  max-width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
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
    const currentSlide = props.location.pathname.split('/').slice(1).length - 1;

    return (
      <Slide currentSlide={currentSlide} slide={0}>
        <Page
          title="Degree Manager"
          subtitle={<Text color={styles.textLight}>Edit degrees here</Text>}
          titleLeft={<PrimaryButton onClick={this.handleNewDegreeOpen}>+ New Degree</PrimaryButton>}
        >
          <DegreeList
            masteredDegrees={masteredDegrees}
            onMasteredDegreeClick={onMasteredDegreeClick}
          />
        </Page>
      </Slide>
    );
  };

  renderDegreeDetail = (props: RouteComponentProps<{ masteredDegreeId: string }>) => {
    const currentSlide = props.location.pathname.split('/').slice(1).length - 1;
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);
    const degreeDetail = masteredDegreeId ? (
      <DegreeDetail masteredDegreeId={masteredDegreeId} />
    ) : null;

    return (
      <Slide currentSlide={currentSlide} slide={1}>
        {degreeDetail}
      </Slide>
    );
  };

  renderDegreePreview = (props: RouteComponentProps<{ masteredDegreeId: string }>) => {
    const currentSlide = props.location.pathname.split('/').slice(1).length - 1;
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);
    return (
      <Slide currentSlide={currentSlide} slide={2}>
        {masteredDegreeId && <DegreePreview masteredDegreeId={masteredDegreeId} />}
      </Slide>
    );
  };

  render() {
    const { newDegreeModalOpen } = this.state;
    return (
      <React.Fragment>
        <Content>
          <Route path="/degree-manager" children={this.renderDegreeList} />
          <Route path="/degree-manager/:masteredDegreeId" children={this.renderDegreeDetail} />
          <Route
            path="/degree-manager/:masteredDegreeId/preview"
            children={this.renderDegreePreview}
          />
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
