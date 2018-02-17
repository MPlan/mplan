import * as React from 'react';
import { View, Text, Button, Box } from '../components';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';

const Input = styled.input`
  padding: ${styles.spacing(0)};
  border: solid ${styles.borderWidth} ${styles.border};
  flex: 1;
`;
const Form = styled.form`
  display: flex;
`;
const CatalogContainer = styled(View) `
  flex: 1;
  flex-direction: row;
`;
const CatalogContent = styled(View) `
  flex: 1;
  overflow: auto;
`;
const CatalogAside = styled(View) `
  border-left: solid ${styles.borderWidth} ${styles.border};
`;
const SearchContainer = styled(View) `
  padding: ${styles.spacing(0)};
  border-bottom: solid ${styles.borderWidth} ${styles.border};
`;
const CatalogBody = styled(View) `
  flex: 1;
  overflow: auto;
`;
const CatalogCourse = styled(View) `
  margin: ${styles.spacing(0)};
  padding: ${styles.spacing(0)};
  border: solid ${styles.borderWidth} ${styles.border};
  flex-shrink: 0;
`;
const CatalogCourseHeader = styled(View) `
  flex-direction: row;
  margin-bottom: ${styles.spacing(0)};
`;
const CatalogCourseFooter = styled(View) `
  flex-direction: row;
  justify-content: flex-end;
`;
const CourseName = styled(Text) `
  margin-left: ${styles.spacing(0)};
`;
const Pagination = styled(View) `
  flex-direction: row;
  padding: ${styles.spacing(0)};
  align-items: baseline;
  border-top: solid ${styles.border} ${styles.borderWidth};
`;
const PaginationButtons = styled(View) `
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;
const ButtonContainer = styled(View) `
  margin-left: ${styles.spacing(0)};
`;

export class Catalog extends Model.store.connect({
  scope: store => store.catalog,
  descope: (store, catalog: Model.Catalog) => store.set('catalog', catalog),
}) {

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setStore(store => store.setSearch(value));
  }

  onNextPage = () => {
    this.setStore(catalog => catalog.nextPage());
  }

  onPreviousPage = () => {
    this.setStore(catalog => catalog.previousPage());
  }

  onAddToBoxClick(course: Model.Course) {
    this.setGlobalStore(store => store.addToBox(course));
  }

  render() {
    return <CatalogContainer>
      <CatalogContent>
        <SearchContainer>
          <Form onSubmit={this.onFormSubmit}>
            <Input onInput={this.onInput} placeholder="Search for a course..." />
          </Form>
        </SearchContainer>

        <CatalogBody>
          {this.store.coursesOnCurrentPage.map(course => <CatalogCourse key={course.id}>
            <CatalogCourseHeader>
              <Text large strong>{course.subjectCode} {course.courseNumber}</Text>
              <CourseName large>{course.name}</CourseName>
            </CatalogCourseHeader>

            <Text>{course.description}</Text>

            <CatalogCourseFooter>
              <Button onClick={() => this.onAddToBoxClick(course)}>+ to box</Button>
            </CatalogCourseFooter>

          </CatalogCourse>)}
        </CatalogBody>

        <Pagination>
          <View>
            <Text>Page {this.store.currentPageIndex + 1}/{Math.max(this.store.totalPages, 1)}</Text>
          </View>
          
          <PaginationButtons>
            <ButtonContainer>
              <Button onClick={this.onPreviousPage}>Previous Page</Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button onClick={this.onNextPage}>Next Page</Button>
            </ButtonContainer>
          </PaginationButtons>
        </Pagination>
      </CatalogContent>

      <CatalogAside>
        <Box />
      </CatalogAside>
    </CatalogContainer>;
  }
}