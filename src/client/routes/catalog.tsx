import * as React from 'react';
import { View, Text, p } from '../components/base';
import * as Model from '../models';
import styled from 'styled-components';
import * as Styles from '../components/styles';
import { Button } from '../components/button';

const Input = styled.input`
  padding: ${p(0)}rem;
  border: solid ${Styles.border} ${0.10}rem;
  flex: 1;
`;

const Form = styled.form`
  display: flex;
`;

export class Catalog extends Model.store.connect({
  scope: store => store.catalog,
  descope: (store, catalog: Model.Catalog) => store.set('catalog', catalog),
  get: catalog => ({
    courses: catalog.courses,
    search: catalog.search,
    coursesOnCurrentPage: catalog.coursesOnCurrentPage,
    totalPages: catalog.totalPages,
    currentPageIndex: catalog.currentPageIndex,
  }),
  set: (catalog, { search, currentPageIndex }) => catalog
    .set('search', search)
    .set('currentPageIndex', currentPageIndex),
}) {

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  onInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setStore(previousStore => ({
      ...previousStore,
      search: e.currentTarget.value,
    }));
  }

  onNextPage = () => {
    this.setStore(previousStore => ({
      ...previousStore,
      currentPageIndex: Math.min(previousStore.currentPageIndex + 1, previousStore.totalPages - 1)
    }));
  }

  onPreviousPage = () => {
    this.setStore(previousStore => ({
      ...previousStore,
      currentPageIndex: Math.max(previousStore.currentPageIndex - 1, 0)
    }));
  }

  render() {
    return <View _="catalog" flex>
      <View
        padding
        flex={{ flexShrink: 0 }}
        style={{ borderBottom: `solid ${Styles.border} ${0.10}rem` }}
      >
        <Form onSubmit={this.onFormSubmit}>
          <Input onInput={this.onInput} placeholder="Search for a course..." />
        </Form>
      </View>
      <View flex overflow>
        {this.state.coursesOnCurrentPage.map(course => <View _="test"
          key={course._id.toHexString()}
          margin
          padding
          border
          flex={{ flexShrink: 0 }}
        >
          <View row margin={{ bottom: true }}>
            <Text large strong>{course.subjectCode} {course.courseNumber}</Text>
            <Text large margin={{ left: true }}>{course.name}</Text>
          </View>
          <Text>{course.description}</Text>
        </View>)}
      </View>
      <View
        row
        padding
        alignItems="baseline"
        flex={{ flexShrink: 0 }}
        style={{ borderTop: `solid ${Styles.border} ${0.10}rem` }}
      >
        <View>
          <Text>Page {this.state.currentPageIndex + 1}/{Math.max(this.state.totalPages, 1)}</Text>
        </View>
        <View flex row justifyContent="flex-end">
          <View margin={{ left: true }}>
            <Button onClick={this.onPreviousPage}>Previous Page</Button>
          </View>
          <View margin={{ left: true }}>
            <Button onClick={this.onNextPage}>Next Page</Button>
          </View>
        </View>
      </View>
    </View>
  }
}