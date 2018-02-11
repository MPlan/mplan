import * as React from 'react';
import { View, Text } from '../components/base';
import * as Model from '../models';

export class Catalog extends Model.store.connect({
  scope: store => store.catalog,
  descope: (store, catalog: Model.Catalog) => store.set('catalog', catalog),
  get: catalog => ({
    courses: catalog.courses,
    filteredCourses: catalog.filteredCourses,
    search: catalog.search,
  }),
  set: (catalog, { search }) => catalog.set('search', search),
}) {

  onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  onInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setStore(previousStore => ({
      ...previousStore,
      search: e.currentTarget.value,
    }))
  }

  render() {
    return <View _="catalog" flex overflow>
      <View padding>
        <form onSubmit={this.onFormSubmit}>
          <input onInput={this.onInput} />
        </form>
      </View>
      <View flex overflow>
        {this.state.filteredCourses.map(course => <View _="test"
          key={course._id.toHexString()}
          margin
          padding
          border
          style={{ display: 'block' }}
        >
          <View row margin={{ bottom: true }}>
            <Text large strong>{course.subjectCode} {course.courseNumber}</Text>
            <Text large margin={{left: true}}>{course.name}</Text>
          </View>
          <Text>{course.description}</Text>
        </View>)}
      </View>
    </View>
  }
}