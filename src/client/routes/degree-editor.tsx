import * as React from 'react';
import * as Model from '../models';
import { View, Text, FloatingActionButton, DegreeItem, Toolbox, Fa } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

const Container = styled(View)`
  flex: 1;
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

const fabActions = {
  degree: {
    text: 'New degree',
    icon: 'plus',
    color: styles.blue,
  },
};

export class DegreeEditor extends Model.store.connect() {
  searchRef: HTMLInputElement | null | undefined;

  componentDidMount() {
    const searchRef = this.searchRef;
    if (!searchRef) return;
    searchRef.focus();
    searchRef.select();
  }

  handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleSearchRef = (e: HTMLInputElement | null | undefined) => {
    this.searchRef = e;
  };

  render() {
    return (
      <Container>
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
                  innerRef={this.handleSearchRef}
                />
                <DegreeSearchButton>
                  <Fa icon="search" />
                </DegreeSearchButton>
              </DegreeSearch>
              <DegreeList>
                {this.store.masteredDegrees.map(masteredDegree => [
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                  <DegreeItem masteredDegree={masteredDegree} />,
                ])}
                {this.store.masteredDegrees.map(masteredDegree => (
                  <DegreeItem key={masteredDegree.id + '-2'} masteredDegree={masteredDegree} />
                ))}
              </DegreeList>
            </DegreeListCard>
          </DegreeListContainer>
        </Body>
        <FloatingActionButton message="Create..." actions={fabActions} onAction={() => {}} />
      </Container>
    );
  }
}
