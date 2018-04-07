import * as React from 'react';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { ActionableText } from './actionable-text';
import * as styles from '../styles';
import * as Model from '../models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';

/*
 * each filter should:
 * 
 * * react to changes in the search
 * * show/hide more results
 * * 
 */

const Container = styled(View)`
  padding: ${styles.space(0)};
`;
const Header = styled(Text)`
  font-weight: ${styles.bold};
`;
const Item = styled(Text)`
  margin-left: ${styles.space(0)};
`;
const List = styled(View)``;

export interface Filter {
  id: string;
  apply: (course: Model.Course) => boolean;
}

export interface CategoryProps<T> {
  name: string;
  categoryPicker: (course: Model.Course) => T;
  courses: Immutable.Seq.Indexed<Model.Course>;
  onFilterChange: (filter: Filter) => void;
}
interface CategoryState {}

export class Category<T> extends React.Component<CategoryProps<T>, CategoryState> {
  categoryId = uuid();
  constructor(props: CategoryProps<T>) {
    super(props);
    this.state = {};
  }

  get distinctCategories() {
    return this.props.courses
      .map(course => this.props.categoryPicker(course))
      .reduce((distinctSet, pickedCategory) => {
        return distinctSet.set(pickedCategory, (distinctSet.get(pickedCategory) || 0) + 1);
      }, Immutable.Map<T, number>());
  }

  render() {
    return (
      <Container>
        <Header>{this.props.name}</Header>
        <List>
          {this.distinctCategories
            .entrySeq()
            .sortBy(c => c[0])
            .take(10)
            .map(([category, count]) => (
              <Item>
                {category} {count}
              </Item>
            ))}
        </List>
      </Container>
    );
  }
}
