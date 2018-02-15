import * as React from 'react';
import { View, Text, p } from '../components/base';
import * as Model from '../models';
import styled from 'styled-components';
import * as Styles from '../components/styles';
import { Button } from '../components/button';
import { Box } from '../components/box';

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
    return <View row>
      <View flex>
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
          {this.store.coursesOnCurrentPage.map(course => <View _="test"
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
            <View row justifyContent="flex-end">
              <Button onClick={() => this.onAddToBoxClick(course)}>+ to box</Button>
            </View>
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
            <Text>Page {this.store.currentPageIndex + 1}/{Math.max(this.store.totalPages, 1)}</Text>
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
      <View><Box /></View>
    </View>;
  }
}