import * as React from 'react';
import * as Model from 'models';
import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { FloatingActionButton } from 'components/floating-action-button';
import { Fa } from 'components/fa';
import { DegreeItem } from 'components/degree-item';
import { DegreeItemSidebar } from 'components/degree-item-sidebar';
import { MasteredDegreeDetail } from 'components/mastered-degree-detail';
import { Route, RouteComponentProps, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import * as styles from 'styles';

const Container = styled(View)`
  flex: 1;
  position: relative;
  overflow: hidden;
`;
const Head = styled(View)`
  margin: ${styles.space(1)};
`;
const Header = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const SubHeader = styled(Text)`
  color: ${styles.textLight};
`;
const Body = styled(View)`
  flex: 1;
  flex-direction: row;
`;
const DegreeMaster = styled(View)`
  transition: all 400ms;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
`;
const DegreeDetailContainer = styled(View)`
  position: absolute;
  transition: all 400ms;
  left: 100%;
  width: 100%;
  height: 100%;
  flex-direction: row;
`;
const DegreeDetailContent = styled(View)`
  margin: 0 auto;
  overflow: auto;
  & > * {
    flex-shrink: 0;
  }
`;
const DegreeListContainer = styled(View)`
  width: 30rem;
  margin: ${styles.space(0)} auto;
  margin-bottom: ${styles.space(3)};
`;
const SelectDegree = styled(Text)`
  font-size: ${styles.space(1)};
  color: ${styles.textLight};
  margin-bottom: ${styles.space(0)};
`;
const DegreeListCard = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)} 0;
  box-shadow: ${styles.boxShadow(1)};
`;
const DegreeSearch = styled.form`
  display: flex;
  padding: ${styles.space(-1)} ${styles.space(0)};
  flex-direction: row;
  align-items: center;
  margin-bottom: ${styles.space(-1)};
  flex-shrink: 0;
`;
const DegreeSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
  font-family: ${styles.fontFamily};
`;
const DegreeSearchButton = styled.button`
  border: none;
  background-color: transparent;
`;
const DegreeList = styled(View)`
  overflow: auto;
`;
const Sidebar = styled(View)`
  width: 16rem;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
`;
const SidebarBack = styled(NavLink)`
  display: flex;
  outline: none;
  border: none;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  &:hover {
    box-shadow: 0 0.1rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  &:active {
    box-shadow: 0 0.2rem 1.3rem 0 rgba(12, 0, 51, 0.2);
  }
  &,
  & * {
    color: ${styles.text};
    text-decoration: none;
  }
  &:hover {
    text-decoration: underline;
  }
`;
const SidebarHeaderText = styled(Text)`
  color: ${styles.textLight};
  margin: ${styles.space(0)};
`;
const SidebarHeaderIcon = styled(View)`
  min-width: ${styles.space(1)};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: ${styles.space(-1)};
`;
const SidebarContent = styled(View)`
  overflow: auto;
  flex: 1;
`;

const initialState = {
  selectedMasteredDegree: undefined as Model.MasteredDegree | undefined,
};
type InitialState = typeof initialState;

export interface DegreeEditorProps extends RouteComponentProps<{}> {
  masteredDegrees: Model.MasteredDegree[];
  onCreateMasteredDegreeGroup: (masteredDegree: Model.MasteredDegree) => void;
  onCreateMasteredDegree: () => void;
  onMasteredDegreeUpdate: (
    masteredDegree: Model.MasteredDegree,
    update: (degree: Model.MasteredDegree) => Model.MasteredDegree,
  ) => void;
}
export interface DegreeEditorState extends InitialState {}

export class DegreeEditor extends React.PureComponent<DegreeEditorProps, DegreeEditorState> {
  searchMainRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    const searchRef = this.searchMainRef.current;
    if (!searchRef) return;
    searchRef.focus();
    searchRef.select();
  }

  static getDerivedStateFromProps(nextProps: DegreeEditorProps, previousState: DegreeEditorState) {
    const degreeIdMatch = /\/degree-editor\/([^&/?#]*)/.exec(nextProps.location.pathname);
    // the OR makes the `selectedMasteredDegree` undefined
    const degreeId = (degreeIdMatch && degreeIdMatch[1]) || 'NO_MATCH';
    return {
      ...previousState,
      selectedMasteredDegree: nextProps.masteredDegrees.find(degree => degree.id === degreeId),
    };
  }

  handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  renderRoute = (e: RouteComponentProps<any>) => {
    const degreeId = e.match.params['degreeId'] as string;
    const selectedDegree = this.props.masteredDegrees.find(degree => degree.id === degreeId);
    if (!selectedDegree) {
      return <Text>Not found</Text>;
    }
    return (
      <DegreeDetailContent>
        <MasteredDegreeDetail
          masteredDegree={selectedDegree}
          onDegreeUpdate={update => this.props.onMasteredDegreeUpdate(selectedDegree, update)}
        />
      </DegreeDetailContent>
    );
  };

  render() {
    return (
      <Container>
        <DegreeMaster style={{ left: !!this.state.selectedMasteredDegree ? '-100%' : 0 }}>
          <Head>
            <Header>Degree Editor</Header>
            <SubHeader>Edit degrees here.</SubHeader>
          </Head>
          <Body>
            <DegreeListContainer>
              <SelectDegree>Select a degree...</SelectDegree>
              <DegreeListCard>
                <DegreeSearch tabIndex={0} onSubmit={this.handleSearchSubmit}>
                  <DegreeSearchInput
                    type="input"
                    placeholder="search for a degree..."
                    innerRef={this.searchMainRef}
                  />
                  <DegreeSearchButton>
                    <Fa icon="search" />
                  </DegreeSearchButton>
                </DegreeSearch>
                <DegreeList>
                  {this.props.masteredDegrees.map(masteredDegree => (
                    <DegreeItem key={masteredDegree.id} masteredDegree={masteredDegree} />
                  ))}
                </DegreeList>
              </DegreeListCard>
            </DegreeListContainer>
          </Body>
        </DegreeMaster>
        <DegreeDetailContainer style={{ left: !!this.state.selectedMasteredDegree ? 0 : '100%' }}>
          <Sidebar>
            <SidebarBack to="/degree-editor">
              <SidebarHeaderIcon>
                <Fa icon="chevronLeft" color={styles.textLight} />
              </SidebarHeaderIcon>
              <SidebarHeaderText>Back</SidebarHeaderText>
            </SidebarBack>
            <DegreeSearch tabIndex={0} onSubmit={this.handleSearchSubmit}>
              <DegreeSearchInput type="input" placeholder="search for a degree..." />
              <DegreeSearchButton>
                <Fa icon="search" />
              </DegreeSearchButton>
            </DegreeSearch>
            <SidebarContent>
              {this.props.masteredDegrees.map(masteredDegree => (
                <DegreeItemSidebar key={masteredDegree.id} masteredDegree={masteredDegree} />
              ))}
            </SidebarContent>
          </Sidebar>
          <Route path="/degree-editor/:degreeId" render={this.renderRoute} />
        </DegreeDetailContainer>
        <FloatingActionButton
          message="Create..."
          actions={
            /*if*/ this.state.selectedMasteredDegree
              ? {
                  degreeGroup: {
                    text: 'New degree group',
                    icon: 'plus',
                    color: styles.blue,
                  },
                }
              : {
                  degree: {
                    text: 'New degree',
                    icon: 'plus',
                    color: styles.blue,
                  },
                }
          }
          onAction={action => {
            if (action === 'degreeGroup') {
              const selectedMasteredDegree = this.state.selectedMasteredDegree;
              if (!selectedMasteredDegree) return;
              this.props.onCreateMasteredDegreeGroup(selectedMasteredDegree);
            } else if (action === 'degree') {
              this.props.onCreateMasteredDegree();
            }
          }}
        />
      </Container>
    );
  }
}
