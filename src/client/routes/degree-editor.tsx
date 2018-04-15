import * as React from 'react';
import * as Model from '../models';
import {
  View,
  Text,
  FloatingActionButton,
  DegreeItem,
  Toolbox,
  Fa,
  DegreeItemSidebar,
} from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)`
  flex: 1;
  position: relative;
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
const DegreeDetailContent = styled(View)``;
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
const SidebarBack = styled.button`
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

const fabActions = {
  degree: {
    text: 'New degree',
    icon: 'plus',
    color: styles.blue,
  },
};

export class DegreeEditor extends Model.store.connect({
  initialState: {
    detailOpen: true,
    selectedMasterId: '',
  },
}) {
  searchRefMain: HTMLInputElement | null | undefined;
  searchRefSidebar: HTMLInputElement | null | undefined;

  componentDidMount() {
    const searchRef = this.searchRefMain;
    if (!searchRef) return;
    searchRef.focus();
    searchRef.select();
  }

  handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleSearchRefMain = (e: HTMLInputElement | null | undefined) => {
    this.searchRefMain = e;
  };

  handleSearchRefSidebar = (e: HTMLInputElement | null | undefined) => {
    this.searchRefSidebar = e;
  };

  handleDegreeClick(degree: Model.MasteredDegree) {
    this.setState(previousState => ({
      ...previousState,
      detailOpen: true,
      selectedMasterId: degree.id,
    }));
  }

  handleSidebarHeaderClick = () => {
    this.setState(previousState => ({
      ...previousState,
      detailOpen: false,
    }));
  };

  render() {
    return (
      <Container>
        <DegreeMaster style={{ left: this.state.detailOpen ? '-100%' : 0 }}>
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
                    innerRef={this.handleSearchRefMain}
                  />
                  <DegreeSearchButton>
                    <Fa icon="search" />
                  </DegreeSearchButton>
                </DegreeSearch>
                <DegreeList>
                  {this.store.masteredDegrees.map(masteredDegree => (
                    <DegreeItem
                      key={masteredDegree.id}
                      masteredDegree={masteredDegree}
                      onClick={() => this.handleDegreeClick(masteredDegree)}
                    />
                  ))}
                </DegreeList>
              </DegreeListCard>
            </DegreeListContainer>
          </Body>
        </DegreeMaster>
        <DegreeDetailContainer style={{ left: this.state.detailOpen ? 0 : '100%' }}>
          <Sidebar>
            <SidebarBack onClick={this.handleSidebarHeaderClick}>
              <SidebarHeaderIcon>
                <Fa icon="chevronLeft" color={styles.textLight} />
              </SidebarHeaderIcon>
              <SidebarHeaderText>Back</SidebarHeaderText>
            </SidebarBack>
            <DegreeSearch tabIndex={0} onSubmit={this.handleSearchSubmit}>
              <DegreeSearchInput
                type="input"
                placeholder="search for a degree..."
                innerRef={this.handleSearchRefSidebar}
              />
              <DegreeSearchButton>
                <Fa icon="search" />
              </DegreeSearchButton>
            </DegreeSearch>
            <SidebarContent>
              {this.store.masteredDegrees.map(masteredDegree => (
                <DegreeItemSidebar
                  key={masteredDegree.id}
                  masteredDegree={masteredDegree}
                  selected={masteredDegree.id === this.state.selectedMasterId}
                  onClick={() => this.handleDegreeClick(masteredDegree)}
                />
              ))}
            </SidebarContent>
          </Sidebar>
          <DegreeDetailContent>
            <Text>Degree content goes here</Text>
          </DegreeDetailContent>
        </DegreeDetailContainer>
        <FloatingActionButton message="Create..." actions={fabActions} onAction={() => {}} />
      </Container>
    );
  }
}
