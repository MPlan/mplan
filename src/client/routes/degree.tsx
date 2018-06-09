import * as React from 'react';
import * as Model from '../models';
import {
  View,
  Text,
  ActionableText,
  FloatingActionButton,
  DegreeGroup,
  Modal,
  SearchResultCourse,
} from '../components';
import styled from 'styled-components';
import * as styles from '../styles';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

const Container = styled(View)`
  padding: ${styles.space(1)};
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(1)};
  flex-shrink: 0;
`;
const HeaderMain = styled(View)`
  flex: 1;
`;
const HeaderRight = styled(View)`
  align-items: flex-end;
`;
const Major = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const Disclaimer = styled(Text)`
  color: ${styles.textLight};
`;
const Underline = styled(Text)`
  text-decoration: underline;
  color: ${styles.textLight};
`;
const Credits = styled(Text)`
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  margin-bottom: ${styles.space(-1)};
`;
const Percentage = styled(Text)`
  color: ${styles.textLight};
`;
const DegreeGroupContainer = styled(View)`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  margin-right: -${styles.space(2)};
`;
const CourseSearchForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const CourseInput = styled.input`
  font-family: ${styles.fontFamily};
  padding: ${styles.space(-1)};
`;
const SearchForACourse = styled(Text)`
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const SearchResults = styled(View)``;
const FormMajor = styled.form`
  display: flex;
  flex-direction: column;
`;

const fabActions = {
  group: {
    text: 'New course group',
    icon: 'plus',
    color: styles.blue,
  },
  course: {
    text: 'Course to existing group',
    icon: 'plus',
    color: styles.blue,
  },
};

export class Degree extends Model.store.connect({
  initialState: {
    modalOpen: false,
    pickingMajor: false,
    currentDegreeGroup: undefined as Model.DegreeGroup | undefined,
    searchResults: [] as Model.Course[],
  },
}) {
  readonly searchInput$ = new Subject<string>();
  searchInputSubscription: Subscription | undefined;

  componentDidMount() {
    this.searchInputSubscription = this.searchInput$
      .pipe(debounceTime(50))
      .subscribe(this.handleSearchInput);
  }

  handleSearchInput = (searchInput: string) => {
    const searchResults = this.store.catalog
      .search(searchInput)
      .results.take(10)
      .toArray();

    this.setState(previousState => ({
      ...previousState,
      searchResults,
    }));
  };

  componentWillUnmount() {
    super.componentWillMount();
    if (this.searchInputSubscription) {
      this.searchInputSubscription.unsubscribe();
    }
  }

  handleFab = (action: keyof typeof fabActions) => {
    if (action === 'group') {
      this.setStore(store =>
        store.updateDegree(degree =>
          degree.addDegreeGroup(
            new Model.DegreeGroup({
              _id: Model.ObjectId(),
              name: 'New Group',
              description: 'Custom group',
            }),
          ),
        ),
      );
    }
  };

  handleDegreeGroupNameChange(degreeGroup: Model.DegreeGroup, newName: string) {
    this.setStore(store =>
      store.updateDegree(degree =>
        degree.updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.set('name', newName)),
      ),
    );
  }

  handleAddCourseClick(degreeGroup: Model.DegreeGroup) {
    this.setState(previousState => ({
      ...previousState,
      modalOpen: true,
      currentDegreeGroup: degreeGroup,
      searchResults: [],
    }));
  }

  handleBackdropClick = () => {
    this.setState(previousState => ({
      ...previousState,
      modalOpen: false,
    }));
  };

  handleCourseSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleCourseSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.searchInput$.next(e.currentTarget.value);
  };

  handleAddCourse(course: string | Model.Course) {
    const currentDegreeGroup = this.state.currentDegreeGroup;
    if (!currentDegreeGroup) return;
    this.setStore(store =>
      store.updateDegree(degree =>
        degree.updateDegreeGroup(currentDegreeGroup, group => group.addCourse(course)),
      ),
    );
  }

  handleDeleteCourse(group: Model.DegreeGroup, course: string | Model.Course) {
    this.setStore(store =>
      store.updateDegree(degree =>
        degree.updateDegreeGroup(group, group => group.deleteCourse(course)),
      ),
    );
  }

  handleDeleteGroup(group: Model.DegreeGroup) {
    this.setStore(store => store.updateDegree(degree => degree.deleteDegreeGroup(group)));
  }

  handleChangeDegree = () => {
    this.setState(previousState => ({
      ...previousState,
      pickingMajor: true,
    }));
  };

  handleMajorBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      pickingMajor: false,
    }));
  };

  handleMajorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectElement = e.currentTarget.querySelector('.select-major') as HTMLSelectElement;
    const majorId = selectElement.value;
    if (!majorId) return;
    this.setStore(store => {
      const major = store.masteredDegrees.get(majorId);
      if (!major) {
        console.warn('could not find major');
        return store;
      }
      const newStore = store.updateDegree(degree => {
        const clearedDegree = degree.update('degreeGroups', groups => groups.clear());
        const newDegree = major.masteredDegreeGroups.reduce((degree, masteredDegreeGroup) => {
          return degree.set('masteredDegreeId', majorId).addDegreeGroup(
            new Model.DegreeGroup({
              _id: Model.ObjectId(),
              name: masteredDegreeGroup.name,
              _courseIds: masteredDegreeGroup.defaultIds,
            }),
          );
        }, clearedDegree);
        return newDegree;
      });
      return newStore;
    });
  };

  handleSelectMajor(majorId: string) {}

  render() {
    const currentDegreeGroup = this.state.currentDegreeGroup;
    const degree = this.store.user.degree;
    const masteredDegree = this.store.masteredDegrees.get(degree.masteredDegreeId);
    return (
      <Container>
        <Header>
          <HeaderMain>
            <Major>{masteredDegree && masteredDegree.name}</Major>
            <Disclaimer>
              <Underline>Disclaimer:</Underline> This page is <Underline>not</Underline> a degree
              audit and should not be treated like one.{' '}
              <ActionableText>Click here for more info.</ActionableText>
            </Disclaimer>
          </HeaderMain>
          <HeaderRight>
            <Credits>
              {degree.completedCredits()}/{degree.totalCredits()} credits
            </Credits>
            <Percentage>{degree.percentComplete().toFixed(2)}% complete</Percentage>
            <ActionableText onClick={this.handleChangeDegree}>
              Click here to change degree!
            </ActionableText>
          </HeaderRight>
        </Header>
        <DegreeGroupContainer>
          {degree.degreeGroups.map(group => (
            <DegreeGroup
              key={group.id}
              degreeGroup={group}
              onNameChange={newName => this.handleDegreeGroupNameChange(group, newName)}
              onAddCourse={() => this.handleAddCourseClick(group)}
              onDeleteCourse={course => this.handleDeleteCourse(group, course)}
              onDeleteGroup={() => this.handleDeleteGroup(group)}
            />
          ))}
        </DegreeGroupContainer>
        <FloatingActionButton message="Add…" actions={fabActions} onAction={this.handleFab} />
        <Modal
          open={this.state.modalOpen}
          title={`Adding courses to ${currentDegreeGroup ? currentDegreeGroup.name : ''}`}
          size="medium"
          onBlurCancel={this.handleBackdropClick}
        >
          <CourseSearchForm onSubmit={this.handleCourseSearchSubmit}>
            <SearchForACourse>Search for a course...</SearchForACourse>
            <CourseInput
              type="search"
              placeholder="e.g. MATH 115"
              onChange={this.handleCourseSearchChange}
            />
          </CourseSearchForm>
          <SearchResults>
            {this.state.searchResults.map(result => (
              <SearchResultCourse
                key={result.id}
                course={result}
                onAddCourse={() => this.handleAddCourse(result)}
              />
            ))}
          </SearchResults>
        </Modal>
        <Modal
          title="Pick a major!"
          open={this.state.pickingMajor}
          onBlurCancel={this.handleMajorBlur}
        >
          <FormMajor onSubmit={this.handleMajorSubmit}>
            <select className="select-major">
              {this.store.masteredDegrees
                .valueSeq()
                .sortBy(degree => degree.name)
                .map(degree => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name}
                  </option>
                ))}
            </select>
            <div>
              <button type="button" onClick={this.handleMajorBlur}>
                cancel
              </button>
              <button type="submit">select major</button>
            </div>
          </FormMajor>
        </Modal>
      </Container>
    );
  }
}
