import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { get } from 'utilities/get';

import { Route, Redirect } from 'react-router';
import { Page } from 'components/page';
import { View } from 'components/view';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { createSlides } from 'components/slides';
import { NewDegreeModal } from './components/new-degree-modal';
import { DegreeList } from './components/degree-list';
import { DegreeDetail } from './components/degree-detail';
import { DegreePreview } from './components/degree-preview';

const { Slide, Slides } = createSlides();

const Content = styled(View)`
  max-width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
`;

interface DegreeEditorProps {
  locationPathname: string;
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

  get currentSlide() {
    const { locationPathname } = this.props;

    if (/\/degree-manager\/.*\/preview/i.test(locationPathname)) return 2;
    if (/\/degree-manager\/.*\/groups\/.*/i.test(locationPathname)) return 2;
    if (/\/degree-manager\/.*/i.test(locationPathname)) return 1;
    return 0;
  }

  handleNewDegreeOpen = () => {
    this.setState({ newDegreeModalOpen: true });
  };
  handleNewDegreeClose = () => {
    this.setState({ newDegreeModalOpen: false });
  };

  renderDegreeManager = ({ match }: RouteComponentProps<any>) => {
    const { masteredDegrees, onMasteredDegreeClick } = this.props;

    return (
      <Slide slide={0} active>
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
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);
    const degreeDetail = masteredDegreeId && <DegreeDetail masteredDegreeId={masteredDegreeId} />;
    const active = !!props.match;

    if (active) {
      if (!degreeDetail) return <Redirect to="/degree-manager" />;
    }

    return (
      <Slide slide={1} active={!!degreeDetail}>
        {degreeDetail}
      </Slide>
    );
  };

  renderCourseGroup = (
    props: RouteComponentProps<{ masteredDegreeId: string; courseGroupId: string }>,
  ) => {
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);
    const groupId = get(props, _ => _.match.params.courseGroupId);

    const active = !!props.match;
    if (active) {
      if (!masteredDegreeId) return <Redirect to="degree-manager" />;
      if (!groupId) return <Redirect to={`/degree-manager/${masteredDegreeId}`} />;
    }

    return (
      <Slide slide={2} active={active}>
        <Text>course group</Text>
      </Slide>
    );
  };

  renderDegreePreview = (props: RouteComponentProps<{ masteredDegreeId: string }>) => {
    const masteredDegreeId = get(props, _ => _.match.params.masteredDegreeId);

    return (
      <Slide slide={2} active={!!masteredDegreeId}>
        {masteredDegreeId && <DegreePreview masteredDegreeId={masteredDegreeId} />}
      </Slide>
    );
  };

  render() {
    const { newDegreeModalOpen } = this.state;

    return (
      <React.Fragment>
        <Slides currentSlide={this.currentSlide}>
          <Route path="/degree-manager" children={this.renderDegreeManager} />
          <Route path="/degree-manager/:masteredDegreeId" children={this.renderDegreeDetail} />
          <Route
            path="/degree-manager/:masteredDegreeId/groups/:courseGroupId"
            children={this.renderCourseGroup}
          />
          <Route
            path="/degree-manager/:masteredDegreeId/preview"
            children={this.renderDegreePreview}
          />
        </Slides>

        <NewDegreeModal
          open={newDegreeModalOpen}
          onClose={this.handleNewDegreeClose}
          onCreateNewDegree={this.props.onCreateDegree}
        />
      </React.Fragment>
    );
  }
}
